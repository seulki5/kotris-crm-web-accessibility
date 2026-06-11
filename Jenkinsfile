def PROD_SERVERS = ['PROD-rail-crm-01', 'PROD-rail-crm-02']

pipeline {
    agent none

    environment {
        // ── 공통 설정 (변경 불필요) ──────────────────
        REGISTRY      = '10.141.25.34:15000'
        PROJECT_PATH  = 'kotris_repo'
        REGISTRY_CRED = 'registry-credentials'
        NEXUS_CRED    = 'nexus-credentials'

        // ── 프로젝트별 설정 ─────────────────────────
        IMAGE_NAME    = 'kotris-crm-web-mh'
        SERVICE_NAME  = 'crm-web'
        DEV_LABEL     = 'DEV-rail-GUI-batch'
        DEPLOY_DIR    = '/home/kotris_app/crm'

        // ── Managed Files (Base ID → -dev / -prod 자동 붙음) ──
        COMPOSE_ID    = 'kotris-crm-webapp-compose'
        COMPOSE_FILE  = 'podman-compose.yml'
        ENV_ID        = 'kotris-crm-web-mh-env-production'
        ENV_FILE      = 'conf/.env.production'

        // ── 버전 추출 ──
        VERSION_CMD   = "grep -m1 '\"version\"' package.json | sed 's/.*\"version\": *\"\\(.*\\)\".*/\\1/'"
    }

    parameters {
        choice(name: 'DEPLOY_SERVER', choices: ['없음', 'DEV', 'PROD-rail-crm-01', 'PROD-rail-crm-02', 'PROD-ALL'],
               description: '배포할 서버 선택')
        string(name: 'RECOVER_VERSION', defaultValue: '',
               description: '롤백 시 이미지 태그 입력 (예: 1.0.0)')
    }

    triggers {
        gitlab(
            triggerOnPush:                 true,
            triggerOnMergeRequest:         false,
            triggerOnAcceptedMergeRequest: true,
            triggerOnNoteRequest:          false,
            branchFilterType:             'NameBasedFilter',
            includeBranchesSpec:          'deploy'
        )
    }

    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timeout(time: 30, unit: 'MINUTES')
        disableConcurrentBuilds()
    }

    stages {

        stage('Init') {
            agent { label 'built-in' }
            steps {
                script {
                    def br = env.GIT_BRANCH ?: env.BRANCH_NAME ?: ''
                    def isDeploy  = (br ==~ /.*deploy$/  || br == 'deploy')
                    if (isDeploy && params.DEPLOY_SERVER == '없음') {
                        env.TARGET_SERVER = 'DEV'
                    } else {
                        env.TARGET_SERVER = params.DEPLOY_SERVER
                    }
                    env.SKIP_ALL       = (env.TARGET_SERVER == '없음') ? 'true' : 'false'
                    env.IS_DEV_DEPLOY  = (env.TARGET_SERVER == 'DEV') ? 'true' : 'false'
                    env.IS_PROD_DEPLOY = env.TARGET_SERVER.startsWith('PROD') ? 'true' : 'false'
                    echo "Branch: ${br} -> TARGET_SERVER=${env.TARGET_SERVER}"
                }
            }
        }

        stage('Prepare Recover') {
            agent { label 'built-in' }
            when { expression { return params.RECOVER_VERSION?.trim() } }
            steps {
                script {
                    env.IMAGE_TAG = params.RECOVER_VERSION.trim()
                    echo "RECOVER -> ${env.TARGET_SERVER} / ${env.IMAGE_TAG}"
                }
            }
        }

        stage('Checkout') {
            agent { label 'built-in' }
            when {
                allOf {
                    expression { return !params.RECOVER_VERSION?.trim() }
                    expression { env.SKIP_ALL != 'true' }
                }
            }
            steps {
                checkout scm
                script {
                    def ver = sh(script: "${VERSION_CMD}", returnStdout: true).trim()
                    env.IMAGE_TAG = ver ?: 'latest'
                    echo "Checkout -> ${env.IMAGE_TAG}"
                }
                stash name: 'source', includes: '**/*'
            }
        }

        stage('Build Image') {
            agent { label 'built-in' }
            when {
                allOf {
                    expression { return !params.RECOVER_VERSION?.trim() }
                    expression { env.SKIP_ALL != 'true' }
                }
            }
            steps {
                unstash 'source'
                sh """
                    podman --remote build --no-cache --ulimit nofile=65535:65535 \\
                        -t ${REGISTRY}/${PROJECT_PATH}/${IMAGE_NAME}:${IMAGE_TAG} \\
                        -t ${REGISTRY}/${PROJECT_PATH}/${IMAGE_NAME}:latest \\
                        -f Containerfile .
                """
            }
        }

        stage('Test') {
            agent { label 'built-in' }
            when {
                allOf {
                    expression { return !params.RECOVER_VERSION?.trim() }
                    expression { env.SKIP_ALL != 'true' }
                }
            }
            steps {
                sh "podman --remote image inspect ${REGISTRY}/${PROJECT_PATH}/${IMAGE_NAME}:${IMAGE_TAG}"
            }
        }

        stage('Push Image') {
            agent { label 'built-in' }
            when {
                allOf {
                    expression { return !params.RECOVER_VERSION?.trim() }
                    expression { env.SKIP_ALL != 'true' }
                }
            }
            steps {
                withCredentials([usernamePassword(
                    credentialsId: "${NEXUS_CRED}",
                    usernameVariable: 'REG_USER', passwordVariable: 'REG_PASS'
                )]) {
                    sh """
                        podman --remote login ${REGISTRY} --username "\$REG_USER" --password "\$REG_PASS"
                        podman --remote push ${REGISTRY}/${PROJECT_PATH}/${IMAGE_NAME}:${IMAGE_TAG}
                        podman --remote push ${REGISTRY}/${PROJECT_PATH}/${IMAGE_NAME}:latest
                    """
                }
            }
            post { always { sh "podman --remote image prune -f || true" } }
        }

        stage('Deploy DEV') {
            agent { label "${DEV_LABEL}" }
            when { expression { env.IS_DEV_DEPLOY == 'true' } }
            options { skipDefaultCheckout(true) }
            steps {
                withCredentials([usernamePassword(
                    credentialsId: "${NEXUS_CRED}",
                    usernameVariable: 'REG_USER', passwordVariable: 'REG_PASS'
                )]) {
                    lock(resource: "${IMAGE_NAME}-deploy-dev") {
                        configFileProvider([
                            configFile(fileId: "${COMPOSE_ID}-dev",  targetLocation: "${DEPLOY_DIR}/${COMPOSE_FILE}"),
                            configFile(fileId: "${ENV_ID}-dev",  targetLocation: "${DEPLOY_DIR}/${ENV_FILE}")
                        ]) {
                            sh """
                                mkdir -p ${DEPLOY_DIR}/conf
                                podman --remote login ${REGISTRY} --username "\$REG_USER" --password "\$REG_PASS"
                                sed -i "s|image: ${REGISTRY}/${PROJECT_PATH}/${IMAGE_NAME}:.*|image: ${REGISTRY}/${PROJECT_PATH}/${IMAGE_NAME}:${IMAGE_TAG}|g" ${DEPLOY_DIR}/${COMPOSE_FILE}
                                grep "image:" ${DEPLOY_DIR}/${COMPOSE_FILE}
                                podman-compose -f ${DEPLOY_DIR}/${COMPOSE_FILE} stop ${SERVICE_NAME} 2>/dev/null || true
                                podman-compose -f ${DEPLOY_DIR}/${COMPOSE_FILE} rm -f ${SERVICE_NAME} 2>/dev/null || true
                                podman --remote rmi -f ${REGISTRY}/${PROJECT_PATH}/${IMAGE_NAME}:latest 2>/dev/null || true
                                podman --remote pull ${REGISTRY}/${PROJECT_PATH}/${IMAGE_NAME}:${IMAGE_TAG}
                                podman-compose -f ${DEPLOY_DIR}/${COMPOSE_FILE} up -d --no-deps ${SERVICE_NAME}
                                echo "DEV 배포 완료: ${SERVICE_NAME} -> ${IMAGE_TAG}"
                                podman --remote image prune -f || true
                            """
                        }
                    }
                }
            }
        }

        stage('Deploy PROD') {
            agent none
            when { expression { env.IS_PROD_DEPLOY == 'true' } }
            options { skipDefaultCheckout(true) }
            steps {
                script {
                    def servers = (env.TARGET_SERVER == 'PROD-ALL') ? PROD_SERVERS : [env.TARGET_SERVER]
                    echo "PROD 배포 대상: ${servers.join(', ')}"

                    for (srv in servers) {
                        node(srv) {
                            withCredentials([usernamePassword(
                                credentialsId: "${NEXUS_CRED}",
                                usernameVariable: 'REG_USER', passwordVariable: 'REG_PASS'
                            )]) {
                                lock(resource: "${IMAGE_NAME}-deploy-${srv}") {
                                    configFileProvider([
                                        configFile(fileId: "${COMPOSE_ID}-prod",  targetLocation: "${DEPLOY_DIR}/${COMPOSE_FILE}"),
                                        configFile(fileId: "${ENV_ID}-prod",  targetLocation: "${DEPLOY_DIR}/${ENV_FILE}")
                                    ]) {
                                        sh """
                                            mkdir -p ${DEPLOY_DIR}/conf
                                            podman --remote login ${REGISTRY} --username "\$REG_USER" --password "\$REG_PASS"
                                            sed -i "s|image: ${REGISTRY}/${PROJECT_PATH}/${IMAGE_NAME}:.*|image: ${REGISTRY}/${PROJECT_PATH}/${IMAGE_NAME}:${IMAGE_TAG}|g" ${DEPLOY_DIR}/${COMPOSE_FILE}
                                            grep "image:" ${DEPLOY_DIR}/${COMPOSE_FILE}
                                            podman-compose -f ${DEPLOY_DIR}/${COMPOSE_FILE} stop ${SERVICE_NAME} 2>/dev/null || true
                                            podman-compose -f ${DEPLOY_DIR}/${COMPOSE_FILE} rm -f ${SERVICE_NAME} 2>/dev/null || true
                                            podman --remote pull ${REGISTRY}/${PROJECT_PATH}/${IMAGE_NAME}:${IMAGE_TAG}
                                            podman-compose -f ${DEPLOY_DIR}/${COMPOSE_FILE} up -d --no-deps ${SERVICE_NAME}
                                            echo "PROD 배포 완료: ${SERVICE_NAME} -> ${IMAGE_TAG} [${srv}]"
                                            podman --remote image prune -f || true
                                        """
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    post {
        success { script { try { updateGitlabCommitStatus name: 'build', state: 'success' } catch (e) { echo "GitLab 상태 업데이트 실패: ${e.message}" } } }
        failure { script { try { updateGitlabCommitStatus name: 'build', state: 'failed'  } catch (e) { echo "GitLab 상태 업데이트 실패: ${e.message}" } } }
    }
}
