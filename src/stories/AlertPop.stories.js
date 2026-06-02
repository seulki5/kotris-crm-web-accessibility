import React from "react";

// components
import AlertPopup from '@components/popup/AlertPop'

export default {
    title: 'Components/AlertPopup',
    component: AlertPopup,
    parameters: {
        layout: 'centered',
        docs: {
            story: {
                height: '300px',
            },
        },
    },
    tags: ['autodocs'],
    argTypes: {
        screen: {
            control: 'radio',
            options: ['desktop', 'mobile'],
            description: '스크린 사이즈',
            table: {
                type: { summary: 'desktop | mobile' },
                defaultValue: { summary: 'desktop' }
            }
        },
        mainText: {
            control: 'text',
            description: '팝업 제목 및 텍스트',
            table: {
                type: { summary: 'string' }
            }
        },
        description: {
            control: 'text',
            description: '부가 설명',
            table: {
                type: { summary: 'string' }
            }
        },
        bodyContents: {
            control: false,
            description: '바디 영역',
            table: {
                type: { summary: 'any' }
            }
        },
        tertiaryText: {
            control: 'text',
            description: '취소 버튼 텍스트',
            table: {
                type: { summary: 'string' }
            }
        },
        primaryText: {
            control: 'text',
            description: '확인 버튼 텍스트',
            table: {
                type: { summary: 'string' }
            }
        },
        warningText: {
            control: 'text',
            description: '삭제 버튼 텍스트',
            table: {
                type: { summary: 'string' }
            }
        },
        onClickTertiary: {
            description: '회색 버튼 클릭 시 호출되는 함수',
            control: false,
            table: {
                type: { summary: 'function' }
            }
        },
        onClickPrimary: {
            description: '확인 버튼 클릭 시 호출되는 함수',
            control: false,
            table: {
                type: { summary: 'function' }
            }
        },
        onClickWarning: {
            description: '경고 버튼 클릭 시 호출되는 함수',
            control: false,
            table: {
                type: { summary: 'function' }
            }
        },
        customStyle: {
            control: false,
            description: '버튼 커스텀 스타일',
            table: {
                type: { summary: 'string' }
            }
        },
    },
    decorators: [
        (Story) => (
            <div style={{ minHeight: '10%', minWidth: '60vw', padding: '3rem', backgroundColor: '#f5f5f5' }}>
                <Story />
            </div>
        ),
    ],
}

// 저장 확인 모달 Desktop
export const DesktopCancelAndConfirmButtons = {
    args: {
        screen: 'desktop',
        mainText: '해당 내용을 저장하시겠습니까?',
        description: '팝업내용 관련 부가 설명',
        tertiaryText: '취소',
        primaryText: '저장',
    },
}

// 저장 확인 모달 Mobile
export const MobileCancelAndConfirmButtons = {
    args: {
        screen: 'mobile',
        mainText: '해당 내용을 저장하시겠습니까?',
        description: '팝업내용 관련 부가 설명',
        tertiaryText: '취소',
        primaryText: '저장',
    },
}

// 삭제 확인 모달 Desktop
export const DesktopCancelAndDeleteButtons = {
    args: {
        screen: 'desktop',
        mainText: '내용을 삭제하시겠습니까?',
        description: '팝업내용 관련 부가 설명',
        tertiaryText: '취소',
        warningText: '삭제',
    },
}

// 삭제 확인 모달 Mobile
export const MobileCancelAndDeleteButtons = {
    args: {
        screen: 'mobile',
        mainText: '내용을 삭제하시겠습니까?',
        description: '팝업내용 관련 부가 설명',
        tertiaryText: '취소',
        warningText: '삭제',
    },
}

// 완료 확인 모달 Desktop
export const DesktopOnlyConfirmButton = {
    args: {
        screen: 'desktop',
        mainText: '삭제/저장이 완료되었습니다.',
        description:'팝업내용 관련 부가 설명',
        primaryText: '확인',
    },
}

// 완료 확인 모달 Mobile
export const MobileOnlyConfirmButton = {
    args: {
        screen: 'mobile',
        mainText: '삭제/저장이 완료되었습니다.',
        description:'팝업내용 관련 부가 설명',
        primaryText: '확인',
    },
}

// 커스텀 스타일 모달 Desktop
export const DesktopApplyCustomStyles = {
    args: {
        screen: 'desktop',
        mainText: '커스텀 스타일 모달',
        description: '커스텀 스타일이 적용된 버튼을 포함한 모달입니다.',
        tertiaryText: '취소',
        primaryText: '확인',
        customStyle: 'bg-dynamic-bg-info-primary text-dynamic-text-caution-primary-subtle hover:bg-dynamic-bg-info-primary-bold',
    },
}

// 커스텀 스타일 모달 Mobile
export const MobileApplyCustomStyles = {
    args: {
        screen: 'mobile',
        mainText: '커스텀 스타일 모달',
        description: '커스텀 스타일이 적용된 버튼을 포함한 모달입니다.',
        tertiaryText: '취소',
        primaryText: '확인',
        customStyle: 'bg-dynamic-bg-info-primary text-dynamic-text-caution-primary-subtle hover:bg-dynamic-bg-info-primary-bold',
    },
}
