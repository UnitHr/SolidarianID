# SolidarianID

Repository for the SolidarianID project.

## Main Commands

To create the necessary network for the production environment, run:

```sh
make create-network
```

To start the production application, run:

```sh
make run-prod
```

To stop the production application, run:

```sh
make stop-prod
```

To see other commands of interest, run:

```sh
make help
```

## Services

### Frontend

Location: `frontend/`  
URL: [http://localhost:3005](http://localhost:3005)

### Backend

Location: `backend/`  
API-Gateway URL: [http://localhost:3000/api/v1](http://localhost:3000/api/v1)

#### Microservices URLs

- **User Microservice Base URL:** [http://localhost:3001/users](http://localhost:3001/users)
- **Community Microservice Base URL:** [http://localhost:3002/communities](http://localhost:3002/communities)
- **Statistics Microservice Base URL:** [http://localhost:3003/statistics](http://localhost:3003/statistics)

### Public Documentation

- [User API Documentation](http://localhost:3000/api/v1/doc/users)
- [Community API Documentation](http://localhost:3000/api/v1/doc/communities)

## Backend Software Architecture Diagram

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

## Frontend Software Architecture Diagram

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

## Requirements

Make sure you have the following components installed:

- Docker
- Docker Compose
- make
