import TabControl from '@components/common/TabControl'

const meta = {
    title: 'Components/TabControl',
    component: TabControl,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        options: {
            control: 'array',
            description: '탭 옵션 배열 ({id: string, value: string}[])',
            table: {
                type: { summary: 'array' }
            }
        },
        selectedValue: {
            control: 'text',
            description: '현재 선택된 값 (option의 id값)',
            table: {
                type: { summary: 'string' }
            }
        },
        onChange: {
            control: false,
            description: '탭 클릭시 호출',
            table: {
                type: { summary: 'function' }
            }
        }
    }
}

export default meta

export const Default = {
    args: {
        options: [
            { id: '1', value: '아이템' },
            { id: '2', value: '아이템' },
            { id: '3', value: '아이템' }
        ],
        selectedValue: '1'
    }
}
