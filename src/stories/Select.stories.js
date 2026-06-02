import Select from '../components/common/Select'

const meta = {
    title: 'Components/Select',
    component: Select,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    decorators: [
        (Story) => (
            <div className="flex flex-col gap-4 min-w-[200px] min-h-[200px]">
                <Story />
            </div>
        ),
    ],
    argTypes: {
        size: {
            control: 'radio',
            options: ['sm', 'md'],
            description: 'Select 크기',
            defaultValue: 'sm',
            table: {
                type: { summary: 'sm | md' },
                defaultValue: { summary: 'sm' }
            }
        },
        disabled: {
            control: 'boolean',
            description: '비활성화 상태',
            defaultValue: false,
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: false }
            }
        },
        options: {
            control: 'object',
            description: '선택 옵션 배열 [{id: string, value: string}]',
            table: {
                type: { summary: 'Array' }
            }
        },
        placeholder: {
            control: 'text',
            description: '기본 표시 텍스트',
            defaultValue: 'placeholder',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: '리스트명' }
            }
        },
        title: {
            control: 'text',
            description: '선택 필드 제목',
            defaultValue: '',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: '' }
            }
        },
        direction: {
            control: 'select',
            options: ['vertical', 'horizontal'],
            description: '제목 위치',
            defaultValue: 'vertical',
            table: {
                type: { summary: 'vertical | horizontal' },
                defaultValue: { summary: 'vertical' }
            }
        },
        essential: {
            control: 'boolean',
            description: '필수 선택 여부',
            defaultValue: false,
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: false }
            }
        },
        value: {
            control: 'text',
            description: '선택된 값',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: null }
            }
        },
        onSelect: {
            description: 'Select 변경 시 호출되는 함수',
            control: false,
            table: {
                type: { summary: 'function' }
            }
        },
    }
}

export default meta

const defaultOptions = [
    { id: '1', value: '메뉴아이템 1' },
    { id: '2', value: '메뉴아이템 2' },
    { id: '3', value: '메뉴아이템 3' }
]

// 기본 Select
export const Default = {
    args: {
        size: 'md',
        options: defaultOptions,
    }
}

// 사이즈 예시
export const Sizes = {

    render: () => {

        const defaultOptions = [
            { id: '1', value: '메뉴아이템 1' },
            { id: '2', value: '메뉴아이템 2' },
            { id: '3', value: '메뉴아이템 3' }
        ]

        return (
            <div className="flex flex-col gap-4">
                <Select
                    size="sm"
                    options={defaultOptions}
                    placeholder="Small (sm)"
                    onSelect={() => { }}
                />
                <Select
                    size="md"
                    options={defaultOptions}
                    placeholder="Medium (md)"
                    onSelect={() => { }}
                />
            </div>
        )
    }
}

// 제목 있는 상태 vertical
export const WithVerticalTitle = {
    render: () => {
        const defaultOptions = [
            { id: '1', value: '메뉴아이템 1' },
            { id: '2', value: '메뉴아이템 2' },
            { id: '3', value: '메뉴아이템 3' }
        ]

        return (
            <div className="flex flex-col gap-4">
                <Select
                    size="md"
                    options={defaultOptions}
                    placeholder="제목이 있는 상태"
                    title="제목"
                    essential={true}
                    direction="vertical"
                    onSelect={() => { }}
                />
            </div>
        )
    }
}

// 제목 있는 상태 horizontal
export const WithHorizontalTitle = {
    render: () => {
        const defaultOptions = [
            { id: '1', value: '메뉴아이템 1' },
            { id: '2', value: '메뉴아이템 2' },
            { id: '3', value: '메뉴아이템 3' }
        ]

        return (
            <div className="flex flex-col gap-4">
                <Select
                    size="md"
                    options={defaultOptions}
                    placeholder="제목이 있는 상태"
                    title="제목"
                    essential={true}
                    direction="horizontal"
                    onSelect={() => { }}
                />
            </div>
        )
    }
}

// 비활성화 상태
export const Disabled = {
    render: () => {

        return (
            <div className="flex flex-col gap-4">
                <Select
                    size="md"
                    options={defaultOptions}
                    placeholder="비활성화 상태"
                    disabled={true}
                    onSelect={() => { }}
                />
            </div>
        )
    }
}
