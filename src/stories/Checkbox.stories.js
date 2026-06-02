import Checkbox from '@components/common/Checkbox'

const meta = {
    title: 'Components/Checkbox',
    component: Checkbox,
    parameters: {
        layout: 'centered'
    },
    tags: ['autodocs'],
    argTypes: {
        type: {
            control: 'radio',
            options: ['square', 'brand', 'neutral'],
            description: '체크박스 타입',
            defaultValue: 'square',
            table: {
                type: { summary: 'square | brand | neutral' },
                defaultValue: { summary: 'square' }
            }
        },
        label: {
            description: '체크박스 레이블',
            control: 'text',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: '' }
            }
        },
        isChecked: {
            description: '체크박스 선택 상태',
            control: 'boolean',
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: false }
            }
        },
        disabled: {
            description: '체크박스 비활성화 상태',
            control: 'boolean',
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: false }
            }
        },
        onChange: {
            description: '체크박스 상태 변경 시 호출되는 함수',
            control: false,
            table: {
                type: { summary: '(checked: boolean) => void' }
            }
        }
    }
}

export default meta

// 기본 체크박스
export const Default = {
    args: {
        label: '레이블',
        type: 'square',
        isChecked: false
    }
}

// 레이블이 있는 타입별 체크박스
export const WithLabelByTypes = {
    render: () => {
        return (
            <div className="flex flex-row gap-20">
                <Checkbox
                    id={1}
                    type={'square'}
                    label={'레이블'}
                    isChecked={false}
                    onChange={() => { }}
                />
                <Checkbox
                    id={2}
                    type={'neutral'}
                    label={'레이블'}
                    isChecked={false}
                    onChange={() => { }}
                />
                <Checkbox
                    id={3}
                    type={'brand'}
                    label={'레이블'}
                    isChecked={false}
                    onChange={() => { }}
                />
            </div>
        )
    }
}

// 레이블이 없는 체크박스
export const WithoutLabelByTypes = {
    render: () => {
        return (
            <div className="flex flex-row gap-20">
                <Checkbox
                    id={1}
                    type={'square'}
                    isChecked={false}
                    onChange={() => { }}
                />
                <Checkbox
                    id={2}
                    type={'neutral'}
                    isChecked={false}
                    onChange={() => { }}
                />
                <Checkbox
                    id={3}
                    type={'brand'}
                    isChecked={false}
                    onChange={() => { }}
                />
            </div>
        )
    }
}

// 비활성화된 체크박스
export const Disabled = {
    render: () => {
        return (
            <div className="flex flex-row gap-20">
                <Checkbox
                    type={'square'}
                    label={'레이블'}
                    isChecked={false}
                    disabled
                    onChange={() => { }}
                />
                <Checkbox
                    type={'neutral'}
                    label={'레이블'}
                    isChecked={false}
                    disabled
                    onChange={() => { }}
                />
                <Checkbox
                    type={'brand'}
                    label={'레이블'}
                    isChecked={false}
                    disabled
                    onChange={() => { }}
                />
            </div>
        )
    }
}

// 선택되고 비활성화된 체크박스
export const DisabledChecked = {
    args: {
        label: '레이블',
        isChecked: true,
        disabled: true
    }
}
