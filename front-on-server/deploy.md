项目服务器目录结构：

```bash
/opt/frontend-project/
├── docker-compose.yml
└── frontend/
    ├── Dockerfile
    ├── nginx.conf
    └── /dist # 打包后的文件夹
```

进入目录启动：

```bash
docker compose up -d --build frontend
```

