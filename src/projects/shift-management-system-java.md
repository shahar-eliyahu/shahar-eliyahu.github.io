---
title: Shift Management System
subtitle: Java, OOP and Design Patterns
summary: >-
  A Java system for managing employees, shift schedules, and attendance, built
  around object-oriented design and the Factory, Singleton, Observer, and
  Memento patterns. Console and Swing interfaces share the same underlying
  system logic, including validation, notifications, and undo for check-ins and
  check-outs.
type: Java Software Engineering Project
categories: [software-engineering]
technologies: [Java, OOP, Design Patterns, Swing]

order: 10

links:
  github: https://github.com/shahar-eliyahu/ShiftManager-Java-Project

# Explorer gallery. Media: src/assets/projects_media/shift-management-system-java/images/
# Landscape desktop screenshots, shown whole (`fit: contain`).
cover:
  src: 03-schedule.png
  alt: "Team schedule screen: a weekly calendar of shifts colored by employee, with morning, middle and evening shifts for each day and a line marking the current time"
  fit: contain
gallery:
  - src: 02-time-clock.png
    alt: "Time clock screen for a supervisor on shift: a live clock, check in, check out and undo buttons, hours worked this week, the next shift, this week's shifts and the team on shift now"
    fit: contain
  - src: 05-assign-shift.png
    alt: "Shifts table behind an edit dialog for an open shift, with its date, start and end times, and a list for choosing an employee to assign"
    fit: contain
  - src: 08-inbox.png
    alt: "Notification inbox of an administrator, listing recent changes such as added shifts, an assigned employee, check-ins, an undone check-out and an updated employee"
    fit: contain
  - src: 07-edit-employee.png
    alt: "Employees table behind an edit dialog with fields for an employee's name, birth date, role and rank"
    fit: contain

# Detail page: /projects/shift-management-system-java/. Copy was checked against
# the ShiftManager-Java-Project repository (commit c1b082a).
detailPage: true
caseStudy:
  sections:
    - id: overview
      title: Project Overview
      text: |-
        The Shift Management System is a Java application for managing employees, shifts, and attendance in a workplace. Employees sign in, check in and out, and view their shifts, while supervisors and administrators organize the schedule and the team. What each person can do depends on their rank: worker, supervisor, or administrator.

        The system began as a console application, and a Swing desktop interface was later added on top of the same underlying functionality.
      media:
        - src: 03-schedule.png
          alt: "Team schedule screen: a weekly calendar of shifts colored by employee, with morning, middle and evening shifts for each day and a line marking the current time"
          caption: The weekly team schedule in the Swing interface.

    - id: capabilities
      title: Main Capabilities
      items:
        - title: Time Tracking
          text: |-
            Employees check in and out of their shifts and can undo their last action. The time clock shows their current shift, their hours this week, and who is working now.
          media:
            - src: 02-time-clock.png
              alt: "Time clock screen for a supervisor on shift: a live clock, check in, check out and undo buttons, hours worked this week, the next shift, this week's shifts and the team on shift now"
              caption: The time clock, with check in, check out, and undo.
        - title: Shift Scheduling
          text: |-
            Administrators create and remove shifts, and supervisors and administrators assign employees and update shift times. Workers see only their own shifts.
          media:
            - src: 05-assign-shift.png
              alt: "Shifts table behind an edit dialog for an open shift, with its date, start and end times, and a list for choosing an employee to assign"
              caption: Assigning an employee to an open shift.

    - id: design
      title: Object-Oriented Design
      text: |-
        The system is organized around focused classes for employees, shifts, and attendance records, with two manager classes that own the data and coordinate the main operations. Inheritance gives employees a shared abstract person base, an enum models their ranks, and interfaces define the managers' operations and the notification contract.

        Keeping this logic in the managers lets both interfaces rely on the same data and core rules instead of each implementing its own.

    - id: patterns
      title: Design Patterns
      text: |-
        Each of the four design patterns solves a specific problem in the system.
      items:
        - title: Factory
          text: |-
            All employees are created through one factory, so the predefined staff and newly added employees are built the same way.
        - title: Singleton
          text: |-
            A single shared store holds the usernames and passwords, giving the whole application one source for sign-in details.
        - title: Observer
          text: |-
            Supervisors and administrators subscribe to the shift manager and are notified about changes to shifts and employees. Subscriptions follow rank changes, and the Swing interface shows these notifications in an inbox.
          media:
            - src: 08-inbox.png
              alt: "Notification inbox of an administrator, listing recent changes such as added shifts, an assigned employee, check-ins, an undone check-out and an updated employee"
              caption: Notifications received by an administrator as an observer.
        - title: Memento
          text: |-
            A shift's state is saved before each check-in and check-out in a history kept for each employee. This lets employees undo their actions in reverse order.

    - id: business-logic
      title: Business Logic and Validation
      text: |-
        The managers validate employee and shift details and protect the system's state, for example by preventing conflicting actions and keeping at least one administrator in the system. Other rank-based restrictions are applied by each interface, which decides what a rank can reach.
      media:
        - src: 07-edit-employee.png
          alt: "Employees table behind an edit dialog with fields for an employee's name, birth date, role and rank"
          caption: Editing an employee. The available ranks depend on who is making the change.

    - id: interfaces
      title: Console and Swing Interfaces
      text: |-
        Both entry points create the same managers and use the same core operations for sign-in, scheduling, attendance, and notifications. The console application provides text menus, while the Swing application adds a time clock, a weekly calendar, shift and employee tables, and a notification inbox.

        The application currently stores its data in memory, so it resets between runs, and its sign-in uses demonstration credentials.

    - id: technology
      title: Technology & Methodology
      tools:
        - name: Java
          use: The core system and both interfaces, using only the standard library.
        - name: Object-Oriented Programming
          use: Inheritance, interfaces, enums, and encapsulation.
        - name: Design Patterns
          use: Factory, Singleton, Observer, and Memento.
        - name: Swing & Java2D
          use: The desktop interface, with custom Java2D drawing.

    - id: source-code
      title: Explore the Source Code
      text: |-
        Explore the managers, design patterns, and both interfaces in the repository.
      links:
        - label: View Source Code on GitHub
          url: https://github.com/shahar-eliyahu/ShiftManager-Java-Project
---
