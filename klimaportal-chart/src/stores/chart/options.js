export const presetOptions = [
    'bar',
    'area',
    'line',
    'radial',
    'bar-stacked',
    'area-stacked',
    'line-stacked',
    'donut',
    'bar-line',
]

export const colorPalette = [
    {
        key: 'red.300',
        hex: '#f9a3a8',
    },
    {
        key: 'red.600',
        hex: '#ff506a',
    },
    {
        key: 'red.900',
        hex: '#ff0035',
    },
    {
        key: 'orange.300',
        hex: '#ffcf96',
    },
    {
        key: 'orange.600',
        hex: '#ff9b54',
    },
    {
        key: 'orange.900',
        hex: '#ff7614',
    },
    {
        key: 'yellow.300',
        hex: '#ffec96',
    },
    {
        key: 'yellow.600',
        hex: '#fbce50',
    },
    {
        key: 'yellow.900',
        hex: '#ffbe05',
    },
    {
        key: 'lemon.300',
        hex: '#fcf6b1',
    },
    {
        key: 'lemon.600',
        hex: '#fbe662',
    },
    {
        key: 'lemon.900',
        hex: '#ffdc05',
    },
    {
        key: 'moss.300',
        hex: '#c6f18f',
    },
    {
        key: 'moss.600',
        hex: '#aadc41',
    },
    {
        key: 'moss.900',
        hex: '#a0d50a',
    },
    {
        key: 'green.300',
        hex: '#a7e3b4',
    },
    {
        key: 'green.600',
        hex: '#62c882',
    },
    {
        key: 'green.900',
        hex: '#20b54f',
    },
    {
        key: 'cyan.300',
        hex: '#75d8de',
    },
    {
        key: 'cyan.600',
        hex: '#51b7b5',
    },
    {
        key: 'cyan.900',
        hex: '#14a5a3',
    },
    {
        key: 'blue.300',
        hex: '#87b0ff',
    },
    {
        key: 'blue.600',
        hex: '#4983d9',
    },
    {
        key: 'blue.900',
        hex: '#2b6bb5',
    },
    {
        key: 'purple.300',
        hex: '#c08df5',
    },
    {
        key: 'purple.600',
        hex: '#ae53ce',
    },
    {
        key: 'purple.900',
        hex: '#9534b7',
    },
    {
        key: 'pink.300',
        hex: '#ea88cf',
    },
    {
        key: 'pink.600',
        hex: '#e945a3',
    },
    {
        key: 'pink.900',
        hex: '#d90e83',
    },
]

export const stackedOptions = [
    {
        label: 'Aus',
        value: 'off',
    },
    {
        label: 'Normal',
        value: 'normal',
    },
    {
        label: '100%',
        value: '100%',
    },
]

export const chartTypeOptions = [
    {
        label: 'Line',
        value: 'line',
    },
    {
        label: 'Area',
        value: 'area',
    },
    {
        label: 'Bar',
        value: 'bar',
    },
    {
        label: 'Radial',
        value: 'radial',
    },
    {
        label: 'Donut',
        value: 'donut',
    },
]

export const seriesTypeOptions = [
    {
        label: '-',
        value: 'default',
    },
    {
        label: 'Line',
        value: 'line',
    },
    {
        label: 'Area',
        value: 'area',
    },
    {
        label: 'Bar',
        value: 'bar',
    },
]

export const unitOptions = ['Mio. t', 'Mio. t CO2', 'Mio. t CO2e']

export const strokeStyleOptions = [
    {
        label: 'durchgezogen',
        value: 'solid-straight',
        settings: {
            dashArray: 0,
            curve: 'straight',
            width: 2,
        },
    },
    {
        label: 'durchgezogen & geglättet',
        value: 'solid-smooth',
        settings: {
            dashArray: 0,
            curve: 'smooth',
            width: 2,
        },
    },
    {
        label: 'gestrichelt',
        value: 'dashed-straight',
        settings: {
            dashArray: 5,
            curve: 'straight',
            width: 2,
        },
    },
    {
        label: 'gestrichelt & geglättet',
        value: 'dashed-smooth',
        settings: {
            dashArray: 5,
            curve: 'smooth',
            width: 2,
        },
    },
]

export const fillStyleOptions = [
    {
        label: '0% transparent',
        value: 'opacity-100',
        settings: {
            opacity: 1,
            type: 'solid',
        },
    },
    {
        label: '25% transparent',
        value: 'opacity-75',
        settings: {
            opacity: 0.75,
            type: 'solid',
        },
    },
    {
        label: '50% transparent',
        value: 'opacity-50',
        settings: {
            opacity: 0.5,
            type: 'solid',
        },
    },
    {
        label: '75% transparent',
        value: 'opacity-25',
        settings: {
            opacity: 0.25,
            type: 'solid',
        },
    },
]

export const dataLabelOptions = [
    {
        label: 'Aus',
        value: 'off',
    },
    {
        label: 'Oben',
        value: 'top',
    },
    {
        label: 'Oben & versetzt',
        value: 'top-offset',
    },
    {
        label: 'Unten & versetzt',
        value: 'bottom-offset',
    },
]
