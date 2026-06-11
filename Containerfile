FROM 10.141.25.34:15000/kotris_repo/npm-maven-builder:1.0.0 as builder

COPY ./ /build/

WORKDIR /build
RUN npm cache clean --force -verbose
RUN npm install --legacy-peer-deps
RUN npm run build

FROM 10.141.25.34:15000/kotris_repo/node22-httpd-ubi9:1.0.4 as runner

COPY --from=builder /build/.next/standalone /app

WORKDIR /app
#ENV NODE_ENV=production

EXPOSE 80
EXPOSE 443

Entrypoint ["node","server.js"]
