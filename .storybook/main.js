import path from 'path'

const config = {
    stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx)"],
    addons: [
        "@storybook/addon-links",
        "@storybook/addon-essentials",
        "@storybook/addon-onboarding",
        "@storybook/addon-interactions",
        '@storybook/addon-styling-webpack',
    ],
    framework: {
        name: "@storybook/nextjs",
        options: {},
    },
    docs: {
        autodocs: 'tag',
    },
    core: {
        disableTelemetry: true,
    },
    staticDirs: ["../public"],
    webpackFinal: async (config) => {
        if (config.resolve) {
            config.resolve.alias = {
                ...config.resolve.alias,
                '@': path.resolve(__dirname, '../src'),
                // next/dynamic 을 shim 으로 대체
                'next/dynamic': path.resolve(__dirname, 'nextDynamicShim.js'),
            }
        }

        // CSS 모듈 설정 추가
        const cssRule = config.module?.rules?.find(
            (rule) => rule.test?.toString().includes("css")
        )

        if (cssRule) {
            cssRule.exclude = /\.module\.css$/
        }

        config.module?.rules?.push({
            test: /\.module\.css$/,
            use: [
                "style-loader",
                {
                    loader: "css-loader",
                    options: {
                        modules: true,
                    },
                },
                "postcss-loader",
            ],
        })

        return config
    }
};
export default config;
