---
title: CarKeep
subtitle: Vehicle Management & Maintenance Tracking
summary: >-
  CarKeep is a cross-platform vehicle management application built with
  Flutter and Supabase. It centralizes vehicle information, maintenance
  history, insurance, licenses, and documents while supporting multiple
  vehicles, shared access with role-based permissions, and automatic service
  tracking.
type: Full-Stack Cross-Platform Application
categories: [applications]
technologies: [Flutter, Dart, Supabase, PostgreSQL, Row Level Security]

order: 5

links:
  github: https://github.com/shahar-eliyahu/CarKeep

# Explorer gallery. Media: src/assets/projects_media/carkeep/
# All portrait phone screenshots, shown whole (`fit: contain`).
cover:
  src: home.png
  alt: "CarKeep home screen titled My Vehicles, listing a Hyundai i20, a Toyota Corolla and a Mazda 3, each with its vehicle number and the days left until its test, license and insurance renewals and its next service date"
  fit: contain
gallery:
  - src: vehicle_overview.jpg
    alt: "Toyota Corolla overview with the user's role shown as owner, and cards for the annual test and vehicle license with their expiry dates, insurance, and the next service date; tabs for overview, documents and history"
    fit: contain
  - src: history.jpg
    alt: "Hyundai i20 history tab with separate histories for services, annual tests, vehicle licenses and insurance"
    fit: contain
  - src: documents.jpg
    alt: "Hyundai i20 documents tab grouping uploaded files by type, a vehicle license image and a service receipt PDF, each with view, download and delete actions, and an Upload document button"
    fit: contain

# Detail page: /projects/carkeep/. All copy is owner-approved and was checked
# against the CarKeep repository (Flutter + Supabase; no Firebase).
detailPage: true
caseStudy:
  sections:
    - id: overview
      title: Project Overview
      text: |-
        CarKeep is a cross-platform application developed with Flutter and Supabase to simplify the management of multiple vehicles.

        It brings vehicle information, maintenance records, insurance, licenses, and documents into one organized digital space.

        The application combines an intuitive interface with structured data management, role-based permissions, and automated business logic.
      media:
        - src: home.png
          alt: "CarKeep home screen titled My Vehicles, listing a Hyundai i20, a Toyota Corolla and a Mazda 3, each with its vehicle number and the days left until its test, license and insurance renewals and its next service date"

    - id: demo
      title: See CarKeep in Action
      text: |-
        Explore how CarKeep organizes vehicle information, tracks maintenance and renewals, and provides convenient access to important vehicle records.
      media:
        - video: Demo.mp4
          title: CarKeep demo
          poster: carkeep-video-poster.webp

    - id: features
      title: Key Features
      items:
        - title: Vehicle Management & Overview
          text: |-
            CarKeep allows users to manage multiple vehicles and view important information, including insurance, annual vehicle tests, licenses, and upcoming maintenance.

            Each vehicle has its own digital record, while the home screen provides a centralized overview of all registered vehicles.
          media:
            - src: vehicle_overview.jpg
              alt: "Toyota Corolla overview with the user's role shown as owner, and cards for the annual test and vehicle license with their expiry dates, insurance, and the next service date; tabs for overview, documents and history"
        - title: Vehicle History & Service Tracking
          text: |-
            CarKeep maintains a chronological history of vehicle events, including services, repairs, annual tests, license renewals, and insurance renewals.

            The current vehicle status is automatically derived from its event history. When a newer event is removed, the application can restore the previous relevant record as the current state.

            Service tracking also uses mileage and dates to calculate upcoming maintenance.
          media:
            - src: history.jpg
              alt: "Hyundai i20 history tab with separate histories for services, annual tests, vehicle licenses and insurance"
        - title: Document Management
          text: |-
            Users can upload and organize vehicle-related documents, including licenses, insurance records, service documents, and annual test records.

            Documents can also be uploaded while creating a vehicle event, allowing CarKeep to associate the document with the relevant event and generate an appropriate document name.

            Files are stored using Supabase Storage.
          media:
            - src: documents.jpg
              alt: "Hyundai i20 documents tab grouping uploaded files by type, a vehicle license image and a service receipt PDF, each with view, download and delete actions, and an Upload document button"
        - title: Shared Vehicle Access
          text: |-
            CarKeep supports sharing vehicles between multiple users through role-based permissions.

            Three roles are supported:

            - **Owner:** Full control over the vehicle, including managing members, changing permissions, transferring ownership, and deleting the vehicle.
            - **Admin:** Can edit vehicle information and manage events and documents.
            - **Member:** Can view shared vehicle information without editing permissions.

            Each vehicle has one owner, providing a clear ownership and access-control model.
        - title: Account Management
          text: |-
            CarKeep includes user registration, authentication, profile updates, password management, and account deletion.

            Account deletion also considers shared vehicle ownership, requiring ownership transfer before an owner can delete an account when necessary.

    - id: technology
      title: Technology & Architecture
      text: |-
        CarKeep was developed using Flutter and Dart for its cross-platform interface, with Supabase providing authentication, PostgreSQL database services, document storage, and backend functionality.

        Row Level Security (RLS) is used to enforce database access permissions, and a Supabase Edge Function handles secure account deletion.

        The application follows a layered architecture that separates data models, repositories, business logic, screens, and reusable UI components.
      tools:
        - name: Flutter & Dart
          use: Cross-platform application development.
        - name: Supabase
          use: Backend services and authentication.
        - name: PostgreSQL
          use: Relational data storage.
        - name: Row Level Security
          use: Database-level access control.
        - name: Supabase Storage
          use: Vehicle document management.
        - name: Supabase Edge Functions
          use: Secure account deletion.

    - id: testing
      title: Testing
      text: |-
        The project includes automated unit, widget, and integration tests, with a local Supabase environment used to support backend testing and development.

        The testing setup covers application logic and workflows involving authentication, database access, storage permissions, and backend services.

    - id: source-code
      title: Explore the Source Code
      text: |-
        Explore the implementation of CarKeep, including its Flutter interface, Supabase integration, vehicle management logic, and role-based access-control system.
      links:
        - label: View Source Code on GitHub
          url: https://github.com/shahar-eliyahu/CarKeep

visual:
  id: carkeep
  label: MOBILE APPLICATION
  kicker: CARKEEP
  headline: Vehicle Management
---
