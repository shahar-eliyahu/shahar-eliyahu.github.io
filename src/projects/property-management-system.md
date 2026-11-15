---
title: Property Management System
subtitle: Spring Boot, REST API and MySQL
summary: >-
  A full-stack property management platform built on a Spring Boot REST API.
  Operators manage properties, tenants, leases, payments, and expenses through a
  web dashboard, while the backend enforces role-based access and stores the
  data in MySQL through JPA and Hibernate. Developed as a team project, with a
  primary focus on backend development.
type: Spring Boot Backend Team Project
categories: [software-engineering]
technologies: [Java, Spring Boot, REST APIs, MySQL, JPA/Hibernate, Docker, JUnit, Testcontainers, JavaScript]

order: 7.5

links:
  github: https://github.com/shahar-eliyahu/property-management-system

# Explorer gallery. Media: src/assets/projects_media/property-management-system/images/
# Landscape desktop screenshots from the repository's docs/screenshots/, shown whole
# (`fit: contain`). properties.png is a local copy with the System ID values in the
# response panel blurred (they contain team members' names); dashboard.png is unchanged.
cover:
  src: properties.png
  alt: "Properties screen of the web dashboard: a form for adding a property, a list with one sample property, a form for updating it, and a panel showing the API's JSON response"
  fit: contain
gallery:
  - src: dashboard.png
    alt: "Dashboard with a sidebar for properties, tenants, leases, payments, expenses and reports, summary cards for properties, active leases, tenants, income, pending payments and expenses, and quick actions"
    fit: contain

# Detail page: /projects/property-management-system/. Copy was checked against
# the property-management-system repository (commit 6145849).
detailPage: true
caseStudy:
  sections:
    - id: overview
      title: Project Overview
      text: |-
        The Property Management System is a full-stack platform for managing rental properties. Operators manage properties, tenants, leases, payments, and expenses through a web dashboard, and every operation goes through a Spring Boot REST API that applies the business rules and role-based access before reaching a MySQL database.

        The system was developed as a team project, with a primary focus on backend development, including the REST API, service layer, and database integration.
      media:
        - src: properties.png
          alt: "Properties screen of the web dashboard: a form for adding a property, a list with one sample property, a form for updating it, and a panel showing the API's JSON response"
          caption: Managing properties, with the API response shown beside the forms.

    - id: capabilities
      title: Main Capabilities
      items:
        - title: Property Operations
          text: |-
            Operators work with properties, tenants, leases, payments, and expenses from one dashboard, which summarizes the portfolio and offers quick actions for common tasks.
          media:
            - src: dashboard.png
              alt: "Dashboard with a sidebar for properties, tenants, leases, payments, expenses and reports, summary cards for properties, active leases, tenants, income, pending payments and expenses, and quick actions"
              caption: The dashboard, with summary cards and quick actions.
        - title: Users and Roles
          text: |-
            Users register, sign in, and update their profiles, with email and password validation. Each user has one of three roles: administrators manage the system's data, operators create and update records, and end users view active records and invoke commands.
        - title: Commands and Administration
          text: |-
            End users invoke commands on records, and every invocation is stored as a history. Administrators can export and clear users, records, and command history.

    - id: architecture
      title: Backend Architecture
      text: |-
        The backend follows a layered design. Controllers map the HTTP endpoints, boundary objects define the API's JSON contract separately from the database entities, a service layer holds the business rules, authentication, and role checks, and data access objects built on Spring Data JPA handle persistence.

        Roles are enforced in the service layer on every request, so the rules apply no matter which client calls the API. A global exception handler turns failures into consistent error responses, and inactive records are hidden from end users as if they did not exist.
      media:
        - src: architecture.png
          alt: "Architecture diagram: the web dashboard calls the Spring Boot application's controllers for users, objects, commands and admin over REST and JSON; requests pass through a service layer for validation, credential checks and role-based access, then a Spring Data JPA and Hibernate data access layer to a MySQL 8 database; a global exception handler returns consistent JSON errors, Swagger UI documents the API, the application and database run with Docker Compose, and JUnit with Testcontainers runs the full API against a real MySQL in Docker"
          caption: The backend's layered architecture and how it runs with Docker Compose.

    - id: data
      title: REST API and Data Management
      text: |-
        Properties, tenants, leases, payments, and expenses share one generic object model: each record has a type, a status, and a flexible set of details stored in a MySQL JSON column, so a new kind of record needs no schema change. Records can be linked as parents and children, for example a property to its leases and a lease to its payments, and the links can be followed in both directions.

        The API supports search by name, partial name, type, and status, and every list endpoint is paginated. Each identifier includes a system ID, so data from several system instances can share one database without collisions. Interactive API documentation is generated with Swagger UI and OpenAPI.

    - id: testing
      title: Testing and Quality
      text: |-
        Integration tests written with JUnit run the full API against a real MySQL database, which Testcontainers starts in Docker for each test run. They cover users, object search, pagination, properties, and command invocation.

    - id: docker
      title: Docker and Development Environment
      text: |-
        A single Docker Compose command starts the application together with MySQL, and the application waits until the database is ready. The image is built in two stages, compiling the project with Gradle and running it on a lightweight Java runtime, and the database connection is configured through environment variables.

    - id: technology
      title: Technology & Methodology
      tools:
        - name: Java & Spring Boot
          use: The REST API and its service layer, built with Java 21.
        - name: JPA & Hibernate
          use: Persistence through Spring Data JPA, with queries derived from method names.
        - name: MySQL
          use: The database, including a JSON column for each record's details.
        - name: REST APIs
          use: Endpoints for users, records, commands, and administration, documented with OpenAPI.
        - name: JUnit & Testcontainers
          use: Integration tests against a real MySQL database in Docker.
        - name: Docker
          use: Docker Compose for the application and database.
        - name: JavaScript
          use: The web dashboard, built with HTML, CSS, and vanilla JavaScript.

    - id: source-code
      title: Explore the Source Code
      text: |-
        Explore the API, its service layer, and the integration tests in the repository.
      links:
        - label: View Source Code on GitHub
          url: https://github.com/shahar-eliyahu/property-management-system
---
