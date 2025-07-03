# SolidarianID

**SolidarianID** es el caso de estudio común desarrollado transversalmente en todas las asignaturas obligatorias del **Máster en Ingeniería del Software** de la **Universidad de Murcia**. Es una plataforma digital impulsada por la ONG _Voluntarios Sin Fronteras_, cuyo objetivo es fomentar la participación ciudadana en causas solidarias a nivel internacional.

La plataforma permite a los usuarios registrarse, crear o unirse a comunidades, dar visibilidad a causas solidarias, participar en acciones concretas (donaciones, voluntariado, eventos) y mantener un historial completo de su actividad solidaria mediante una identidad digital única. Además, SolidarianID incluye funcionalidades sociales como seguimiento de usuarios, valoraciones, comentarios e interacciones privadas.

## Índice

- [SolidarianID](#solidarianid)
  - [Índice](#índice)
  - [Despliegue](#despliegue)
    - [Requisitos](#requisitos)
    - [Comandos principales](#comandos-principales)
    - [Datos de prueba](#datos-de-prueba)
    - [Servicios](#servicios)
      - [Frontend](#frontend)
      - [Backend](#backend)
      - [Documentación de APIs](#documentación-de-apis)
  - [Asignaturas](#asignaturas)
    - [Desarrollo Full-Stack](#desarrollo-full-stack)
      - [Backend](#backend-1)
      - [Frontend](#frontend-1)
    - [Arquitectura de Datos](#arquitectura-de-datos)
    - [Control de Calidad y Pruebas del Software](#control-de-calidad-y-pruebas-del-software)
    - [Desarrollo de Software en la Nube](#desarrollo-de-software-en-la-nube)
    - [Prácticas Continuas](#prácticas-continuas)
    - [Gestión Ágil de Proyectos](#gestión-ágil-de-proyectos)
  - [Galería de capturas](#galería-de-capturas)
    - [Inicio](#inicio)
    - [Perfil de usuario](#perfil-de-usuario)
    - [Notificaciones](#notificaciones)
    - [Comunidades](#comunidades)
    - [Causas](#causas)
    - [Acciones](#acciones)
    - [Panel de Administración y Estadísticas](#panel-de-administración-y-estadísticas)
  - [Autores \& Copyright](#autores--copyright)

## Despliegue

Esta sección describe los pasos necesarios para desplegar SolidarianID en un entorno de producción utilizando contenedores.

### Requisitos

Asegúrate de tener instalado:

- Docker
- Docker Compose
- Make

### Comandos principales

| Comando               | Descripción                                       |
| --------------------- | ------------------------------------------------- |
| `make create-network` | Crea la red Docker necesaria para el despliegue.  |
| `make run-prod`       | Despliega todos los servicios en modo producción. |
| `make stop-prod`      | Detiene todos los servicios desplegados.          |
| `make help`           | Muestra la lista de comandos disponibles.         |

### Datos de prueba

Para cargar datos de prueba, primero ejecuta `make run-prod`. Luego, ejecuta:

```sh
cd scripts/test_data_loader
python3 test_data_loader.py
```

Los datos generados se encuentran en `scripts/test_data_loader/data/*.json`.

**Credenciales del usuario administrador:**

- **Email:** `admin@admin.com`
- **Contraseña:** `123456Test*`

### Servicios

Principales servicios de la plataforma:

#### Frontend

- **Directorio:** `frontend/`
- **URL:** [http://localhost:5173](http://localhost:5173)

#### Backend

- **Directorio:** `backend/`
- **API Gateway:** [http://localhost:3000/api/v1](http://localhost:3000/api/v1)
- **Servicio de Usuarios:** [http://localhost:3001/users](http://localhost:3001/users)
- **Servicio de Comunidades:** [http://localhost:3002/communities](http://localhost:3002/communities)
- **Servicio de Estadísticas:** [http://localhost:3003/statistics](http://localhost:3003/statistics)

#### Documentación de APIs

- **Usuarios:** [http://localhost:3000/api/v1/doc/users](http://localhost:3000/api/v1/doc/users)
- **Comunidades:** [http://localhost:3000/api/v1/doc/communities](http://localhost:3000/api/v1/doc/communities)

## Asignaturas

### Desarrollo Full-Stack

- [📄 Documentación completa. Cuatrimestre 1.](./doc/Memoria%20DFS_C1%20para%20SolidarianID.pdf)
- [📄 Documentación completa. Cuatrimestre 2.](./doc/Memoria%20DFS_C2%20para%20SolidarianID.pdf)

![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![Handlebars](https://img.shields.io/badge/Handlebars-f0772b?style=for-the-badge&logo=handlebarsdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)
![PWA](https://img.shields.io/badge/PWA-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white)
![Apache Kafka](https://img.shields.io/badge/Apache%20Kafka-231F20?style=for-the-badge&logo=apachekafka&logoColor=white)
![GraphQL](https://img.shields.io/badge/GraphQL-E10098?style=for-the-badge&logo=graphql&logoColor=white)
![OAuth 2.0](https://img.shields.io/badge/OAuth%202.0-3C3C3C?style=for-the-badge&logo=oauth&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![OpenAPI](https://img.shields.io/badge/OpenAPI-6BA539?style=for-the-badge&logo=openapiinitiative&logoColor=white)

En esta asignatura se abordó el desarrollo integral del MVP de SolidarianID, aplicando principios de **Domain-Driven Design (DDD)**, arquitectura limpia y separación por capas. El sistema evolucionó de un diseño monolítico MVC a una arquitectura de **microservicios** orientada a eventos.

A continuación se muestra el diagrama de arquitectura de los principales contenedores y microservicios del backend, así como sus relaciones y flujos de comunicación.

![Backend Software Architecture Diagram](./doc/diagrams/containerArchitectureDiagram.png)

#### Backend

- **Arquitectura aplicada:**
  - Modelado de negocio con DDD.
  - Event Sourcing y CQRS en el microservicio de estadísticas.
  - Comunicación entre microservicios mediante Kafka.
  - Organización en bounded contexts: usuarios, comunidades, estadísticas.
- **API Gateway:** Endpoints REST con proxies a cada microservicio y documentación OpenAPI.
- **GraphQL:** Módulo para exponer datos de forma flexible, útil para clientes móviles y SPA.
- **Seguridad:** Autenticación OAuth2, emisión de tokens JWT y control de acceso por roles y permisos.

A continuación se presenta un diagrama que ilustra la estructura general del backend. Este diagrama muestra la disposición de los principales microservicios, sus componentes internos, las bases de datos utilizadas y los mecanismos de comunicación entre ellos.

```mermaid
graph TB
    User((User))

    subgraph "API Gateway"
        APIGateway["API Gateway<br>NestJS"]

        subgraph "Gateway Components"
            UsersProxy["Users Proxy<br>Middleware"]
            CommProxy["Communities Proxy<br>Middleware"]
            StatProxy["Statistics Proxy<br>Middleware"]
            ActionsProxy["Actions Proxy<br>Middleware"]
            CausesProxy["Causes Proxy<br>Middleware"]
        end
    end

    subgraph "Users Microservice"
        UserMS["Users Service<br>NestJS"]

        subgraph "Users Components"
            AuthService["Auth Service<br>JWT"]
            UserService["User Service<br>TypeORM"]
            HistoryService["History Service<br>TypeORM"]
            NotifService["Notification Service<br>TypeORM"]
        end

        UsersDB[("Users Database<br>PostgreSQL")]
    end

    subgraph "Communities Microservice"
        CommMS["Communities Service<br>NestJS"]

        subgraph "Communities Components"
            CommunityService["Community Service<br>Mongoose"]
            CauseService["Cause Service<br>Mongoose"]
            ActionService["Action Service<br>Mongoose"]
            CommEventsService["Events Service<br>Kafka"]
        end

        CommDB[("Communities Database<br>MongoDB")]
    end

    subgraph "Statistics Microservice"
        StatMS["Statistics Service<br>NestJS"]

        subgraph "Statistics Components"
            CommReports["Community Reports<br>Cassandra"]
            PlatformStats["Platform Statistics<br>Cassandra"]
            OdsStats["ODS Statistics<br>Cassandra"]
        end

        StatsDB[("Statistics Database<br>Cassandra")]
    end

    subgraph "Message Broker"
        Kafka["Event Bus<br>Kafka"]
        Zookeeper["Cluster Management<br>Zookeeper"]
    end

    %% User interactions
    User -->|"Accesses API"| APIGateway

    %% API Gateway routing
    APIGateway --> UsersProxy
    APIGateway --> CommProxy
    APIGateway --> StatProxy
    APIGateway --> ActionsProxy
    APIGateway --> CausesProxy

    %% Proxy routing to services
    UsersProxy -->|"Routes requests"| UserMS
    CommProxy -->|"Routes requests"| CommMS
    StatProxy -->|"Routes requests"| StatMS
    ActionsProxy -->|"Routes requests"| CommMS
    CausesProxy -->|"Routes requests"| CommMS

    %% Service component relationships
    UserMS --> AuthService
    UserMS --> UserService
    UserMS --> HistoryService
    UserMS --> NotifService

    CommMS --> CommunityService
    CommMS --> CauseService
    CommMS --> ActionService
    CommMS --> CommEventsService

    StatMS --> CommReports
    StatMS --> PlatformStats
    StatMS --> OdsStats

    %% Database connections
    UserService -->|"Persists data"| UsersDB
    HistoryService -->|"Persists data"| UsersDB
    NotifService -->|"Persists data"| UsersDB

    CommunityService -->|"Persists data"| CommDB
    CauseService -->|"Persists data"| CommDB
    ActionService -->|"Persists data"| CommDB

    CommReports -->|"Persists data"| StatsDB
    PlatformStats -->|"Persists data"| StatsDB
    OdsStats -->|"Persists data"| StatsDB

    %% Event communication
    Kafka --> Zookeeper
    CommEventsService -->|"Publishes events"| Kafka
    UserMS -->|"Subscribes to events"| Kafka
    StatMS -->|"Subscribes to events"| Kafka
```

#### Frontend

El frontend evolucionó de una interfaz básica renderizada en servidor a una arquitectura moderna basada en componentes.

- **Handlebars (HBS):**
  - Primera versión basada en plantillas Handlebars (MVC).
  - Funcionalidades para administrador: estadísticas y gestión de comunidades.
  - Renderizado en servidor y estilo responsive con Bootstrap.

A continuación se presenta un diagrama que ilustra la arquitectura del frontend NestJS y HBS, destacando la organización de módulos funcionales, los componentes internos y la interacción con microservicios externos.

```mermaid
graph TB
    User((External User))
    Admin((Admin User))

    subgraph "Frontend Application"
        direction TB
        FrontendApp["Frontend App<br>(NestJS)"]

        subgraph "Core Components"
            AppController["App Controller<br>(NestJS Controller)"]
            AppService["App Service<br>(NestJS Service)"]
            ViewEngine["View Engine<br>(Handlebars)"]
            HelperService["Handlebars Helpers<br>(NestJS Service)"]
        end

        subgraph "Feature Modules"
            direction LR
            subgraph "Reports Module"
                ReportController["Report Controller<br>(NestJS Controller)"]
                ReportService["Report Service<br>(NestJS Service)"]
            end

            subgraph "Statistics Module"
                StatController["Statistics Controller<br>(NestJS Controller)"]
                StatService["Statistics Service<br>(NestJS Service)"]
            end

            subgraph "Validation Module"
                ValidController["Validation Controller<br>(NestJS Controller)"]
                ValidService["Validation Service<br>(NestJS Service)"]
            end
        end

        subgraph "Client-Side Components"
            ChartJS["Chart Component<br>(Chart.js)"]
            ReportGen["Report Generator<br>(JavaScript)"]
            Validation["Validation Logic<br>(JavaScript)"]
        end
    end

    subgraph "External Microservices"
        CommunityMS["Community Microservice<br>(External Service)"]
        StatisticsMS["Statistics Microservice<br>(External Service)"]
    end

    %% User interactions
    User -->|"Accesses"| FrontendApp
    Admin -->|"Manages"| FrontendApp

    %% Frontend internal connections
    FrontendApp -->|"Routes to"| AppController
    AppController -->|"Uses"| AppService
    AppController -->|"Renders with"| ViewEngine
    ViewEngine -->|"Uses"| HelperService

    %% Module connections
    AppController -->|"Routes to"| ReportController
    AppController -->|"Routes to"| StatController
    AppController -->|"Routes to"| ValidController

    ReportController -->|"Uses"| ReportService
    StatController -->|"Uses"| StatService
    ValidController -->|"Uses"| ValidService

    %% Client-side connections
    ViewEngine -->|"Serves"| ChartJS
    ViewEngine -->|"Serves"| ReportGen
    ViewEngine -->|"Serves"| Validation

    %% External service connections
    ReportService -->|"Fetches data"| CommunityMS
    ValidService -->|"Fetches data"| CommunityMS
    StatService -->|"Fetches statistics"| StatisticsMS
```

- **React:**
  - Migración a SPA en React para mayor interactividad y modularidad.
  - Módulos: interacción de usuario, búsqueda y filtrado, autenticación, historial, perfil, seguimiento y apoyo a causas.
  - Estado con React Hooks y consumo de API REST con fetch y JWT.

El siguiente diagrama representa la arquitectura del frontend React. Se detallan los flujos principales desde la entrada de la aplicación hasta la gestión del estado global, el uso de GraphQL, los servicios REST, y la integración de funcionalidades PWA como el service worker y notificaciones push.

```mermaid
graph TD

    user["User<br>External Actor"]
    subgraph external["External Systems"]
        backend["Backend API<br>GraphQL/HTTP"]
        pushapi["Web Push APIs<br>Browser Push API"]
    end
    subgraph frontend["Frontend React"]
        entry["Application Entry<br>React/TypeScript"]
        routing["Routing Logic<br>React Router"]
        pages["UI Pages<br>React/TypeScript"]
        components["UI Components<br>React/TypeScript"]
        logic["Business Logic &amp; REST Services<br>TypeScript"]
        gqlDefs["GraphQL Definitions<br>GraphQL/TypeScript"]
        gqlClient["GraphQL Client Engine<br>Apollo Client"]
        state["Global State Management<br>Redux Toolkit"]
        sw["PWA Service Worker<br>JavaScript"]
        hooks["Custom React Hooks<br>React/TypeScript"]

        entry -->|loads| routing
        entry -->|registers Service Worker via| components
        entry -->|configures| gqlClient
        entry -->|initializes| state
        routing -->|routes to| pages
        pages -->|renders| components
        pages -->|uses| logic
        pages -->|accesses state from| state
        pages -->|uses| hooks
        components -->|uses| logic
        components -->|registers| sw
        components -->|uses| hooks
        hooks -->|uses query definitions from| gqlDefs
        hooks -->|executes GraphQL via| gqlClient
        hooks -->|manages state via| state
        logic -->|initiates push subscription via| sw
    end

    user -->|interacts with| entry
    logic -->|calls| backend
    gqlClient -->|fetches/mutates data via GraphQL| backend
    sw -->|handles push events from| pushapi
```

- **Next.js:**

  - Integración para mejorar rendimiento y SEO (SSR + SSG).
  - Rutas dinámicas y adaptación progresiva desde SPA.
  - Navegación optimizada con _prefetch_.

- **Progressive Web App (PWA):**
  - Acceso sin conexión, carga rápida y mejor experiencia móvil.

Esta evolución consolidó un frontend desacoplado, escalable y alineado con las mejores prácticas del desarrollo web moderno.

### Arquitectura de Datos

- [📄 Documentación completa.](./doc/Memoria%20AD%20para%20SolidarianID.pdf)

![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![TypeORM](https://img.shields.io/badge/TypeORM-FE0803?style=for-the-badge&logo=typeorm&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white)
![Cassandra](https://img.shields.io/badge/Cassandra-1287B1?style=for-the-badge&logo=apachecassandra&logoColor=white)
![Kafka](https://img.shields.io/badge/Kafka-231F20?style=for-the-badge&logo=apachekafka&logoColor=white)
![Zookeeper](https://img.shields.io/badge/ZooKeeper-FF7300?style=for-the-badge&logo=apachezookeeper&logoColor=white)

La arquitectura de datos se diseñó siguiendo un enfoque **políglota**, empleando diferentes bases de datos según los requerimientos de cada subsistema:

- **PostgreSQL** (TypeORM): datos estructurados y relacionales (usuarios, credenciales, historial).

```mermaid
erDiagram
    USER {
        uuid id PK
        string firstName
        string lastName
        date birthDate
        string email
        string password
        string bio
        boolean showAge
        boolean showEmail
        string role
    }

    NOTIFICATION {
        uuid id PK
        uuid userId FK
        enum activityType
        uuid entityId
        boolean read
        uuid historyEntryId FK
        timestamp timestamp
        timestamp updatedAt
    }

    HISTORY_ENTRY {
        uuid id PK
        uuid userId FK
        enum type
        enum status
        uuid entityId
        json metadata
        timestamp createdAt
        timestamp updatedAt
    }

    USER_FOLLOWERS {
        uuid followed_id FK
        uuid follower_id FK
    }

    USER ||--o{ NOTIFICATION : "receives"
    USER ||--o{ HISTORY_ENTRY : "has entries"
    USER ||--o{ USER_FOLLOWERS : "follows"
    USER ||--o{ USER_FOLLOWERS : "is followed by"
    NOTIFICATION ||--|| HISTORY_ENTRY : "references"
```

- **MongoDB** (Mongoose): entidades con estructuras dinámicas (comunidades, causas, acciones).

```mermaid
erDiagram
    JOIN_COMMUNITY_REQUEST {
        string id PK
        string userId
        string communityId
        string adminId
        enum status
        string comment
    }
    COMMUNITY {
        string id PK
        string adminId
        string name
        string description
        list_of_string members
        list_of_string causes
    }
    CREATE_COMMUNITY_REQUEST {
        string id PK
        string userId
        string name
        string description
        object cause
        enum status
        date createdAt
        string comment
    }
    CAUSE {
        string id PK
        string title
        string description
        date endDate
        list_of_int ods
        string communityId
        list_of_string actionsIds
        list_of_string supportersIds
        string createdBy
        date createdAt
        date updatedAt
    }
    ACTION {
        string id PK
        enum status
        enum type
        string title
        string description
        string causeId FK
        list_of_object contributions
        number target
        string unit
        number achieved
        string createdBy
        string communityId
        date createdAt
        date updatedAt
        string goodType
        string location
        date date
    }
    CONTRIBUTION {
        string id PK
        string userId
        string actionId FK
        date date
        number amount
        string unit
    }

    COMMUNITY ||--o{ JOIN_COMMUNITY_REQUEST : "join requests"
    CREATE_COMMUNITY_REQUEST ||--|| COMMUNITY : "proposes creation"
    COMMUNITY ||--o{ CAUSE : "contains causes"
    CAUSE ||--o{ ACTION : "contains actions"
    ACTION ||--o{ CONTRIBUTION : "tracks contributions"
```

- **Apache Cassandra**: almacenamiento distribuido para métricas y estadísticas agregadas, permitiendo alta disponibilidad y escalabilidad horizontal.

```mermaid
erDiagram
    ODS_STATISTICS {
        int ods_id PK
        int communities_count
        int causes_count
        int supports_count
    }

    ODS_COMMUNITY {
        int ods_id PK
        text community_id
    }

    COMMUNITY_STATISTICS {
        text community_id PK
        text community_name
        int support_count
        double actions_target_total
        double actions_achieved_total
    }

    COMMUNITIES_BY_COMMUNITY_ID {
        text community_id PK
        text community_name
        text admin_id
        int members_count
        list_of_int ods
    }

    CAUSES_BY_COMMUNITY {
        text community_id PK
        text cause_id
        text cause_name
        int supports_count
        list_of_int ods
    }

    ACTIONS_BY_CAUSE {
        text cause_id PK
        text action_id
        text action_name
        double target
        double achieved
    }

    ODS_STATISTICS ||--o{ ODS_COMMUNITY : "tracks communities"
    COMMUNITIES_BY_COMMUNITY_ID ||--o{ CAUSES_BY_COMMUNITY : "has causes"
    CAUSES_BY_COMMUNITY ||--o{ ACTIONS_BY_CAUSE : "contains actions"
```

La arquitectura incorpora un sistema de eventos basado en Kafka para sincronización y consistencia eventual entre microservicios.

### Control de Calidad y Pruebas del Software

- [📄 Documentación completa.](./doc/Memoria%20CCPS%20para%20SolidarianID.pdf)

![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white)
![Prettier](https://img.shields.io/badge/Prettier-F7B93E?style=for-the-badge&logo=prettier&logoColor=white)
![SonarQube](https://img.shields.io/badge/SonarQube-126ED3?style=for-the-badge&logo=sonarqube&logoColor=white)
![Jest](https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white)
![Stryker Mutation Testing](https://img.shields.io/badge/Stryker-F05E2B?style=for-the-badge&logo=stryker&logoColor=white)
![Supertest](https://img.shields.io/badge/Supertest-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Cypress](https://img.shields.io/badge/Cypress-17202C?style=for-the-badge&logo=cypress&logoColor=white)
![Apache JMeter](https://img.shields.io/badge/Apache%20JMeter-D22128?style=for-the-badge&logo=apachejmeter&logoColor=white)

Esta asignatura se centró en asegurar la calidad del MVP mediante actividades de verificación, validación y automatización de pruebas a nivel frontend, backend y sistema.

- **Plan de pruebas ágil:** definición de escenarios, estrategia de pruebas y métricas de calidad.
- **Revisión estática de código:** aplicación de reglas de estilo mediante ESLint y Prettier.
- **Análisis estático con SonarQube:** evaluación de cobertura, duplicidad, code smells y mantenibilidad.
- **Pruebas unitarias y de mutación:** tests en Jest y evaluación con Stryker para mejorar su efectividad.
- **Pruebas de frontend:** verificación de componentes con @testing-library/react y jest-dom.
- **Pruebas de backend:** tests sobre endpoints usando Supertest, ficheros `.rest` y entornos de prueba aislados.
- **Pruebas e2e:** con Cypress.
- **Pruebas de rendimiento:** usando JMeter para evaluar el rendimiento bajo carga (APDEX, throughput, latencia).
- **Pruebas metamórficas y de regresión:** exploración de técnicas avanzadas orientadas a confiabilidad y mantenimiento.

Estas acciones garantizaron la robustez, mantenibilidad y desempeño del sistema antes del despliegue en producción.

### Desarrollo de Software en la Nube

- [📄 Documentación completa.](./doc/Memoria%20DSEN%20para%20SolidarianID.pdf)

![AWS Lambda](https://img.shields.io/badge/AWS%20Lambda-FF9900?style=for-the-badge&logo=awslambda&logoColor=white)
![Amazon API Gateway](https://img.shields.io/badge/Amazon%20API%20Gateway-CC2264?style=for-the-badge&logo=amazonaws&logoColor=white)
![Amazon S3](https://img.shields.io/badge/Amazon%20S3-569A31?style=for-the-badge&logo=amazonaws&logoColor=white)
![Amazon DynamoDB](https://img.shields.io/badge/Amazon%20DynamoDB-4053D6?style=for-the-badge&logo=amazondynamodb&logoColor=white)
![AWS CloudFormation](https://img.shields.io/badge/AWS%20CloudFormation-5C4EE5?style=for-the-badge&logo=awscloudformation&logoColor=white)
![AWS Boto3](https://img.shields.io/badge/AWS%20Boto3-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)

Se diseñaron y desplegaron funcionalidades serverless sobre AWS para extender SolidarianID hacia una arquitectura escalable y modular, explorando servicios gestionados de Amazon Web Services.

Funcionalidades clave:

- Apoyo anónimo a causas mediante API Gateway, AWS Lambda y DynamoDB.
- Migración parcial de la entidad Cause a DynamoDB.
- Generación automática de avatares con Lambda y almacenamiento en S3.

Estas implementaciones se integran sin afectar la lógica principal del backend, manteniendo una arquitectura flexible y preparada para producción cloud.

### Prácticas Continuas

- [📄 Documentación completa.](./doc/Memoria%20PC%20para%20SolidarianID.pdf)

![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub%20Actions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Docker Compose](https://img.shields.io/badge/Docker%20Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Amazon EC2](https://img.shields.io/badge/Amazon%20EC2-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white)
![Amazon ECR](https://img.shields.io/badge/Amazon%20ECR-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white)

Se diseñó e implementó un pipeline completo de Integración Continua (CI) y Despliegue Continuo (CD) para SolidarianID, automatizando el flujo de desarrollo, pruebas y despliegue.

El pipeline en GitHub Actions incluye 4 etapas:

- **CODE:** validación de estilo.
- **BUILD:** compilación y construcción de imágenes Docker.
- **TEST:** pruebas unitarias y e2e.
- **DEPLOY:** subida de imágenes a ECR y despliegue en EC2.

Este proceso garantiza consistencia, reduce errores y acelera la entrega continua.

### Gestión Ágil de Proyectos

- [📄 Documentación completa.](./doc/Memoria%20GAP%20para%20SolidarianID.pdf)

![Scrum](https://img.shields.io/badge/Scrum-6DB33F?style=for-the-badge&logo=scrumalliance&logoColor=white)
![Secure Scrum](https://img.shields.io/badge/Secure%20Scrum-DD0031?style=for-the-badge&logo=shield&logoColor=white)
![SAFe](https://img.shields.io/badge/SAFe®-002B45?style=for-the-badge&logo=scrumalliance&logoColor=white)
![Jira](https://img.shields.io/badge/Jira-0052CC?style=for-the-badge&logo=jira&logoColor=white)
![Miro](https://img.shields.io/badge/Miro-050038?style=for-the-badge&logo=miro&logoColor=white)

Se definió la visión global del proyecto aplicando metodologías ágiles. Se identificó el MVP y se organizó el desarrollo en iteraciones gestionadas con Scrum.

- **Definición del MVP y roadmap:** artefactos clave, análisis de alcance y planificación de versiones.
- **Planificación de la 1ª iteración:** Sprint Backlog, DoD, criterios de aceptación y tablero Scrum.
- **Gestión avanzada:** análisis de Peopleware, riesgos, escalado ágil (SAFe®) y Secure Scrum.

Este marco alineó las decisiones técnicas con una planificación ágil, centrada en entregar valor de forma iterativa y sostenible.

## Galería de capturas

A continuación se muestran capturas representativas de la plataforma SolidarianID.

### Inicio

![Inicio](./doc/frontend/images/home.png)

### Perfil de usuario

![Perfil de usuario](./doc/frontend/images/profile.png)

### Notificaciones

![Notificaciones](./doc/frontend/images/notifications.png)

### Comunidades

- **Listado de comunidades**

  ![Comunidades](./doc/frontend/images/communities.png)

- **Detalles de una comunidad**

  ![Detalles de la Comunidad](./doc/frontend/images/communities_id.png)

- **Solicitud de creación de comunidad**

  ![Solicitud de Comunidad](./doc/frontend/images/communities_request.png)

### Causas

- **Listado de causas**

  ![Causas](./doc/frontend/images/causes.png)

- **Crear una nueva causa**

  ![Nueva Causa en Comunidad](./doc/frontend/images/communities_id_causes_new.png)

- **Detalles de una causa**

  ![Detalles de la Causa](./doc/frontend/images/cause_id.png)

### Acciones

- **Listado de acciones**

  ![Acciones](./doc/frontend/images/actions.png)

- **Detalles de una acción**

  ![Detalles de Acción en Causa](./doc/frontend/images/causes_id_actions_new.png)

- **Detalles de una acción específica**

  ![Detalles de la Acción](./doc/frontend/images/actions_id.png)

### Panel de Administración y Estadísticas

- **Validación de creación de comunidades:**

  ![Validación en panel admin](./doc/frontend/images/hbs_validation.png)

- **Visualización de estadísticas:**

  ![Estadísticas en panel admin](./doc/frontend/images/hbs_statistics.png)

- **Generación y consulta de informes:**

  ![Informes en panel admin](./doc/frontend/images/hbs_reports.png)

- **Descarga de informes en PDF:**

  ![Informe PDF generado](./doc/frontend/images/hbs_pdf_report.png)

## Autores & Copyright

Este proyecto ha sido desarrollado por los siguientes autores en el marco del **Máster en Ingeniería del Software** de la **Universidad de Murcia**:

- **Hernán Salambay Roldán**
- **Pedro Nicolás Gomariz**
- **Alejandro Montoya Toro**
- **Aurora Hervás López**
- **Dongyue Yu**

Todos los derechos reservados © 2025.

El contenido de este repositorio, salvo que se indique lo contrario, está protegido por la legislación vigente sobre propiedad intelectual. El uso, reproducción o distribución total o parcial del material requiere el consentimiento expreso de los autores.

Para consultas académicas, colaboraciones o permisos, contactar con los autores a través de la Universidad de Murcia.
