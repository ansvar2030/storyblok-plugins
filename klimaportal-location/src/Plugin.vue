<template>
    <div :class="[model.plugin]">
        <div class="location-container">
            <input ref="pacInput" type="text" placeholder="Adresse eingeben" />
            <div
                class="reset"
                @click.prevent.stop="reset"
                v-html="iconX"
                title="Zurücksetzen"
            ></div>
        </div>
        <div ref="map" class="map"></div>
    </div>
</template>

<script>
    const pluginName = 'klimaportal-location'
    const zoomLevel = {
        overview: 14,
        detail: 17,
    }

    import iconX from '!svg-inline-loader!./icons/x.svg'

    export default {
        mixins: [window.Storyblok.plugin],

        data() {
            let address = {
                location: null,
                formatted: null,
            }

            if (this.$props.contentmodel.location) {
                address.location = {
                    lat: parseFloat(this.$props.contentmodel.location.lat),
                    lng: parseFloat(this.$props.contentmodel.location.lng),
                }
                address.address = this.$props.contentmodel.address
            }

            return {
                address,
                centerOfGermany: { lat: 50.954269, lng: 10.301467 },
                autoPlaced: false,
                iconX,
            }
        },

        computed: {},

        methods: {
            initWith() {
                console.log(this)
                return {
                    plugin: pluginName,
                    ...this.address,
                }
            },

            getSettings() {
                let startsWith
                if (this.storyItem?.full_slug) {
                    let parts = this.storyItem.full_slug.split('/')
                    startsWith = parts[0] + '/'
                }

                return this.api
                    .get('cdn/stories', {
                        version: 'draft',
                        content_type: 'settings',
                        starts_with: startsWith,
                    })
                    .then((result) => {
                        if (!result?.data?.stories?.[0]) {
                            return this.api.get('cdn/stories/system/settings', {
                                version: 'draft',
                            })
                        }

                        return result
                    })
                    .then((result) => result?.data?.stories?.[0]?.content)
                    .catch((error) => {
                        console.warn('failed to retrieve settings', error)
                        return false
                    })
            },

            initMap(google) {
                const vm = this
                const geocoder = new google.maps.Geocoder()
                vm.autoPlaced = true

                vm.map = new google.maps.Map(vm.$refs.map, {
                    center: vm.centerOfGermany,
                    zoom: zoomLevel.overview,
                    zoomControl: true,
                    mapTypeControl: false,
                    scaleControl: false,
                    streetViewControl: false,
                    rotateControl: false,
                    fullscreenControl: true,
                })

                const autocomplete = new google.maps.places.Autocomplete(
                    vm.$refs.pacInput,
                    {
                        fields: ['formatted_address', 'geometry', 'name'],
                        strictBounds: false,
                        types: ['address'],
                        componentRestrictions: { country: 'DE' },
                    },
                )

                // autocomplete.bindTo('bounds', map)

                autocomplete.addListener('place_changed', () => {
                    const place = autocomplete.getPlace()

                    if (!place.geometry || !place.geometry.location) {
                        console.warn('place not found', place.name)
                        return
                    }

                    vm.autoPlaced = true

                    // If the place has a geometry, then present it on a map.
                    if (place.geometry.viewport) {
                        vm.map.fitBounds(place.geometry.viewport)
                    } else {
                        vm.map.setCenter(place.geometry.location)
                        vm.map.setZoom(zoomLevel.detail)
                    }

                    vm.address.location = place.geometry.location.toJSON()
                    vm.address.formatted = place.formatted_address
                })

                vm.map.addListener('idle', () => {
                    if (vm.autoPlaced) {
                        vm.autoPlaced = false
                        return
                    }

                    vm.address.location = vm.map.getCenter().toJSON()
                    updateByData(
                        { location: vm.map.getCenter().toJSON() },
                        true,
                    )
                })

                function updateByData(
                    params,
                    skipMapUpdate = false,
                    forceUpdate = false,
                ) {
                    const options = {
                        ...params,
                    }
                    console.log('update by', params, skipMapUpdate, forceUpdate)

                    geocoder.geocode(options, (results, status) => {
                        if (status == 'OK') {
                            const place = results[0]

                            if (!params.location || forceUpdate) {
                                vm.address.location =
                                    place.geometry.location.toJSON()
                            }

                            if (!params.address || forceUpdate) {
                                vm.address.formatted = place.formatted_address
                                vm.$refs.pacInput.value =
                                    place.formatted_address
                            }

                            if (!skipMapUpdate) {
                                vm.autoPlaced = true
                                vm.map.setCenter(
                                    params.location || place.geometry.location,
                                )
                                vm.map.setZoom(zoomLevel.detail)
                            }
                        } else {
                            console.warn('geocoding failed', status)
                        }
                    })
                }

                if (vm.address.location?.lat) {
                    updateByData({ location: vm.address.location })
                } else if (vm.address.formatted) {
                    updateByData({ address: vm.address.formatted })
                } else {
                    this.resetMap()
                }
            },

            resetMap() {
                this.getSettings()
                    .then((settings) => {
                        let location = this.centerOfGermany
                        if (
                            settings &&
                            settings?.defaultAddress?.location?.lat
                        ) {
                            console.info(
                                'using default address',
                                settings.defaultAddress,
                            )
                            location = {
                                lat: parseFloat(
                                    settings.defaultAddress.location.lat,
                                ),
                                lng: parseFloat(
                                    settings.defaultAddress.location.lng,
                                ),
                            }
                        }

                        this.autoPlaced = true
                        this.map.setCenter(location)
                        this.map.setZoom(zoomLevel.overview)
                    })
                    .catch((error) => console.warn(error))
            },

            reset() {
                this.address.location = { lat: null, lng: null }
                this.address.formatted = null
                this.$refs.pacInput.value = ''

                this.resetMap()
            },
        },

        watch: {
            address: {
                handler: function (address) {
                    this.model.location = {
                        lat: address.location.lat
                            ? address.location.lat + ''
                            : null,
                        lng: address.location.lng
                            ? address.location.lng + ''
                            : null,
                    }
                    this.model.formatted = address.formatted
                    this.$emit('changed-model', this.model)
                },
                deep: true,
            },
        },

        mounted() {
            window.mapsReady.then(() => this.initMap(window.google))
        },
    }
</script>

<style lang="scss">
    * {
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
        box-sizing: border-box;
    }

    .klimaportal-location {
        position: relative;

        .location-container {
            display: flex;
            flex-flow: row nowrap;
            margin-bottom: 1rem;
            gap: 0.5rem;

            input {
                display: block;
                flex: auto 1 0;
                width: auto;
                max-width: 350px;
                font-size: 1.125rem;
            }

            .reset {
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 0;
                background-color: #eee;
                border: 1px solid #000;

                svg {
                    display: block;
                    width: 1.5rem;
                    height: 1.5rem;
                }
            }
        }

        .map {
            display: block;
            width: 100%;
            height: 350px;
            background-color: #eee;
            border: 1px solid #000;

            &:after {
                width: 26px;
                height: 37px;
                display: block;
                content: ' ';
                position: absolute;
                top: 50%;
                left: 50%;
                background: url('https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi3.png');
                pointer-events: none;
                user-select: none;
                transform: translate(-50%, -100%);
            }
        }
    }
</style>
