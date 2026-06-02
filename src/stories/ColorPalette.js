import { colors } from '@/styles/colors'

function ColorSwatch({ name, value }) {
    return (
        <div className="w-[120px] h-[120px] flex flex-col">
            <div
                className="flex-1 flex items-center justify-center"
                style={{ backgroundColor: value }}
            >
                <span className={`text-sm ${value === '#FFFFFF' ? 'text-black' : 'text-white'}`}>
                    {name}
                </span>
            </div>
            <div className="py-2 text-center bg-white border border-gray-200">
                <p className="text-xs font-mono">{value}</p>
            </div>
        </div>
    )
}

function ColorScale({ title, colors }) {
    return (
        <div className="mb-12">
            <h3 className="text-lg font-bold mb-4">{title}</h3>
            <div className="flex">
                {colors.map(([key, value]) => {
                    const name = key.split('_')[1] || key
                    return (
                        <div key={key} className="flex-1">
                            <div
                                className="h-[80px] flex items-center justify-center"
                                style={{ backgroundColor: value }}
                            >
                                <span className={`text-sm ${parseInt(name) <= 400 ? 'text-gray-900' : 'text-white'}`}>
                                    {key}
                                </span>
                            </div>
                            <div className="py-2 text-center bg-white border-x border-b border-gray-200">
                                <p className="text-xs font-mono">{value}</p>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export function ColorPalette() {
    const baseColors = [
        ['white', colors.white],
        ['black', colors.black],
    ]

    const colorScales = {
        'Neutral': Object.entries(colors).filter(([key]) => key.startsWith('neutral_')),
        'Red': Object.entries(colors).filter(([key]) => key.startsWith('red_')),
        'Orange': Object.entries(colors).filter(([key]) => key.startsWith('orange_')),
        'Yellow': Object.entries(colors).filter(([key]) => key.startsWith('yellow_')),
        'Lime': Object.entries(colors).filter(([key]) => key.startsWith('lime_')),
        'Green': Object.entries(colors).filter(([key]) => key.startsWith('green_')),
        'Teal': Object.entries(colors).filter(([key]) => key.startsWith('teal_')),
        'LightBlue': Object.entries(colors).filter(([key]) => key.startsWith('lightblue_')),
        'Blue': Object.entries(colors).filter(([key]) => key.startsWith('blue_')),
        'Violet': Object.entries(colors).filter(([key]) => key.startsWith('violet_')),
        'Purple': Object.entries(colors).filter(([key]) => key.startsWith('purple_')),
        'Pink': Object.entries(colors).filter(([key]) => key.startsWith('pink_')),
    }

    return (
        <div className="p-8 bg-white">
            <div className="mb-12">
                <h2 className="text-lg font-bold mb-4">Base</h2>
                <div className="flex gap-4">
                    {baseColors.map(([name, value]) => (
                        <ColorSwatch
                            key={name}
                            name={name}
                            value={value}
                        />
                    ))}
                </div>
            </div>

            {Object.entries(colorScales).map(([name, colors]) => (
                <ColorScale
                    key={name}
                    title={name}
                    colors={colors}
                />
            ))}
        </div>
    )
}