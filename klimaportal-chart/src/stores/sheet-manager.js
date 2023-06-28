import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { useFieldPlugin } from '@/useFieldPlugin'

const token = import.meta.env.VITE_CHART_MANAGER_ACCESS_TOKEN
const baseURL = import.meta.env.VITE_CHART_MANAGER_URL
const defaultCommunitySlug = 'schaffenrath-test'

export const useSheetManagerStore = defineStore(
    'sheet-manager',
    () => {
        const plugin = useFieldPlugin()

        const sheetId = ref('')
        const sheet = computed(() => {
            return communityFolder.value.sheets.find(
                (sheet) => sheet.id === sheetId.value,
            )
        })

        const sheetNames = ref([])
        watch(sheetId, async (newSheetId) => {
            if (!newSheetId) {
                sheetNames.value = []
                return
            }

            sheetNames.value = await getSheetNames(newSheetId)
        })

        const templates = ref([])

        const communityFolder = ref({
            id: '',
            name: '',
            link: '',
            sheets: [],
        })
        const communitySlug = ref(defaultCommunitySlug)

        const storySlug = plugin.data.story.full_slug
        if (storySlug) {
            communitySlug.value = storySlug.split('/')[0]
        }

        function fetchWrapper(path, options) {
            const controller = new AbortController()
            const signal = controller.signal

            const fetchPromise = fetch(
                `${baseURL}${path}?${new URLSearchParams({
                    access_token: token,
                    ...options.query,
                })}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    mode: 'cors',
                    ...options,
                    signal,
                },
            )
                .then((response) => {
                    return response.json()
                })
                .then(({ state, message, data }) => {
                    if (state !== 'success') {
                        throw new Error(message)
                    }

                    return data
                })
                .catch((error) => {
                    console.error(error)
                    throw error
                })

            fetchPromise.abort = () => controller.abort()

            return fetchPromise
        }

        function getCommunityFolder(name) {
            return fetchWrapper('/communities', { query: { name } })
                .then((data) => {
                    communityFolder.value.id = data.id
                    communityFolder.value.name = data.name
                    communityFolder.value.link = data.webViewLink
                    communityFolder.value.sheets = []
                })
                .then(() => getSheets())
        }

        function getTemplates() {
            return fetchWrapper('/templates', {}).then((data) => {
                templates.value = data
            })
        }

        function getSheets() {
            return fetchWrapper('/sheets', {
                query: { communityId: communityFolder.value.id },
            }).then((data) => {
                communityFolder.value.sheets = data
            })
        }

        function copyTemplate(templateId, templateName) {
            return fetchWrapper('/copy-template', {
                method: 'POST',
                body: JSON.stringify({
                    templateId,
                    communityId: communityFolder.value.id,
                    templateName,
                }),
            }).then((data) => {
                return getSheets().then(() => data)
            })
        }

        function getSheetNames(sheetId) {
            console.log('GET SHEET NAMES', sheetId)
            return fetchWrapper('/sheet-names', {
                query: { id: sheetId },
            })
        }

        function getSheetData(sheetId, range = '') {
            return fetchWrapper('/sheet-data', {
                query: { id: sheetId, range },
            })
        }

        async function reset() {
            console.log('sheet-manager: reset')
            await getCommunityFolder(communitySlug.value)
            await getTemplates()
        }

        return {
            // settings
            sheetId,
            communitySlug,

            // fetched
            templates,
            communityFolder,

            // computed
            sheet,
            sheetNames,

            // actions
            reset,
            getCommunityFolder,
            getTemplates,
            getSheets,
            copyTemplate,
            getSheetData,
        }
    },
    {
        persist: {},
    },
)
