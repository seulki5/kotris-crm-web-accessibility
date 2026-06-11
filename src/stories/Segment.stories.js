import { useState } from 'react';

// components
import Segment from '@components/common/Segment'

const meta = {
    title: 'Components/Segment',
    component: Segment,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        size: {
            control: 'radio',
            options: ['sm', 'md'],
            description: '사이즈',
            table: {
                type: { summary: 'sm | md' },
                defaultValue: { summary: 'sm' }
            }
        },
        filled: {
            control: 'boolean',
            description: '배경색 유무',
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: 'true' }
            }
        },
        options: {
            control: 'array',
            description: '세그먼트 옵션 배열 ({id: string, value: string}[])',
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
        fullSize: {
            control: 'boolean',
            description: '가로 넓이 채울지 말지 여부',
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: 'false' }
            }
        },
        onChange: {
            control: false,
            description: '세그먼트 클릭시 호출',
            table: {
                type: { summary: 'function' }
            }
        }
    }
}

export default meta;

// 사이즈: sm
export const SizesWithFilled = {
    render: () => {
        const defaultOptions = [
            { id: '1', value: '아이템' },
            { id: '2', value: '아이템' },
            { id: '3', value: '아이템' }
        ]
        
        return (
            <div className="flex flex-col items-center gap-4">
                <Segment
                    size={"sm"}
                    options={defaultOptions}
                    selectedValue={'1'}
                />
                <Segment
                    size={"md"}
                    options={defaultOptions}
                    selectedValue={'2'}
                />
            </div>
        )
    }
}

// 배경 색상 적용 하지 않는 경우
export const SizesWithUnFilled = {
    render: () => {
        const defaultOptions = [
            { id: '1', value: '아이템' },
            { id: '2', value: '아이템' },
            { id: '3', value: '아이템' }
        ]
        
        return (
            <div className="flex flex-col items-center gap-4">
                <Segment
                    size={"sm"}
                    options={defaultOptions}
                    selectedValue={'1'}
                    filled={false}
                />
                <Segment
                    size={"md"}
                    options={defaultOptions}
                    selectedValue={'2'}
                    filled={false}
                />
            </div>
        )
    }
}

// 인터랙티브 예제
export const Interactive = {
    render: () => {
        const [selected, setSelected] = useState('option1')

        const options = [
            { id: 'option1', value: '옵션 1' },
            { id: 'option2', value: '옵션 2' },
            { id: 'option3', value: '옵션 3' }
        ]

        return (
            <div className="flex flex-col gap-4">
                <Segment
                    options={options}
                    selectedValue={selected}
                    filled={true}
                    fullSize={true}
                    onChange={setSelected}
                />
                <Segment
                    options={options}
                    selectedValue={selected}
                    filled={false}
                    fullSize={false}
                    onChange={setSelected}
                />
            </div>
        )
    }
}

