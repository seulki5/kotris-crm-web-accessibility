import Radio from '@components/common/Radio'
import { useState } from 'react'

const meta = {
    title: 'Components/Radio',
    component: Radio,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        label: {
            control: 'text',
            description: '라디오 버튼 레이블',
            table: {
                type: { summary: 'string' }
            }
        },
        isChecked: {
            control: 'boolean',
            description: '선택 상태',
            table: {
                type: { summary: 'boolean' }
            }
        },
        disabled: {
            control: 'boolean',
            description: '비활성화 상태',
            table: {
                type: { summary: 'boolean' }
            }
        },
        value: {
            control: 'text',
            description: '라디오 값',
            table: {
                type: { summary: 'string' }
            }
        },
        name: {
            control: 'text',
            description: '라디오 그룹 이름',
            table: {
                type: { summary: 'string' }
            }
        }
    }
}

export default meta

// 기본 라디오 버튼
export const Default = {
    args: {
        label: '레이블',
        value: '1',
        name: 'radio-group'
    }
}

// 선택된 라디오 버튼
export const Checked = {
    args: {
        ...Default.args,
        isChecked: true
    }
}

// 비활성화된 라디오 버튼
export const Disabled = {
    args: {
        ...Default.args,
        disabled: true
    }
}

// 선택되고 비활성화된 라디오 버튼
export const CheckedAndDisabled = {
    args: {
        ...Default.args,
        isChecked: true,
        disabled: true
    }
}

// 라디오 그룹 예제
export const Group = {
    render: () => {
        const [selected, setSelected] = useState('1')

        return (
            <div className="flex flex-col gap-3">
                {['1', '2', '3'].map((value) => (
                    <Radio
                        key={value}
                        label={`옵션 ${value}`}
                        name="radio-group"
                        value={value}
                        isChecked={selected === value}
                        onChange={setSelected}
                    />
                ))}
            </div>
        )
    }
}
