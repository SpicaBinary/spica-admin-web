# 基于 Nginx 1.25 的 Alpine Linux 镜像作为基础镜像
# 单独做了一个“前端专用的 Nginx 容器”
FROM nginx:1.25-alpine

# 将本地的 dist 目录复制到容器的 Nginx 网站根目录
COPY dist/ /usr/share/nginx/html/
# 复制自定义的 Nginx 配置文件，到容器内 /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf