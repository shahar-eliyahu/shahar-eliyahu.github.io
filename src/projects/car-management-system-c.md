---
title: Car Management System
subtitle: Data Structures and Memory Management in C
summary: >-
  A modular car dealership management system written in C, built around
  dynamic memory management, pointers, dynamic arrays, linked lists, sorting
  and searching, and function pointers. It manages vehicle inventory, spare
  parts, customer purchase histories, and partner garages, and saves its data
  in both text and binary formats.
type: C Programming Project
categories: [software-engineering]
technologies: [C, Data Structures, Dynamic Memory, Pointers, File I/O]

order: 9

links:
  github: https://github.com/shahar-eliyahu/Car-Management-C-Project

# Explorer gallery. Media: src/assets/projects_media/car-management-system-c/images/
# Landscape terminal screenshots, shown whole (`fit: contain`). 05-parts.png is
# used on the detail page only.
cover:
  src: 01-dashboard.png
  alt: "Terminal dashboard home screen: counts of cars, parts, customers and items sold, a bar chart of cars in stock by brand, the latest sales, and a numbered menu of sections"
  fit: contain
gallery:
  - src: 02-cars-search.png
    alt: "Car inventory table sorted by serial number, with one car highlighted and a status line reporting that it was found with bsearch"
    fit: contain
  - src: 03-customers.png
    alt: "Customers table with ID, name, item count and total spent, above one customer's purchase list of a car and a part with a total"
    fit: contain
  - src: 04-sell.png
    alt: "Sell screen after a sale: the steps of a new sale, the customer's updated purchase list with two cars and a total, and a confirmation message"
    fit: contain

# Detail page: /projects/car-management-system-c/. All copy is owner-approved and
# was checked against the Car-Management-C-Project repository (commit d8526c3).
detailPage: true
caseStudy:
  sections:
    - id: overview
      title: Project Overview
      text: |-
        The Car Management System is a modular dealership management system written in C. It manages vehicle and spare part inventories, customer records and purchase histories, sales, and partner garages, and saves its data in text and binary formats.

        Each part of the system is a separate module, and a central store manager brings the inventories, customers, and garages together. An interactive terminal dashboard and a classic numbered menu both run on the same core functionality.

        The system originally used a numbered text-based menu. A terminal dashboard was later added to provide a more accessible interface while preserving the underlying functionality.
      media:
        - src: 01-dashboard.png
          alt: "Terminal dashboard home screen: counts of cars, parts, customers and items sold, a bar chart of cars in stock by brand, the latest sales, and a numbered menu of sections"
          caption: "The dashboard home screen, with a summary of the store."

    - id: memory
      title: Dynamic Memory Management and Data Structures
      text: |-
        Memory is managed manually throughout the system: records, collections, and strings are allocated at runtime and released when they are no longer needed.

        - **Dynamic arrays:** The inventories and the customer list are arrays of pointers that grow and shrink as records are added and removed.
        - **Linked lists:** Each customer's purchase history uses doubly linked lists, and partner garages use a singly linked list.
        - **Dynamic strings:** A part's manufacturer name is allocated to its exact length.

        Arrays suit the data that is sorted and searched, while linked lists suit purchase histories, which grow with each sale and are read in order.
      items:
        - title: Customers and Purchase Histories
          text: |-
            Customers are stored in a dynamic array, and each customer owns their purchase history. A sale copies the item into that history and releases it from the inventory, so every record has one clear owner. Deleting a customer, loading a file, or exiting the program releases the memory involved.
          media:
            - src: 03-customers.png
              alt: "Customers table with ID, name, item count and total spent, above one customer's purchase list of a car and a part with a total"
              caption: The customer table, with one customer's purchase history.

    - id: sorting-searching
      title: Sorting, Searching, and Function Pointers
      text: |-
        Sorting and searching use the C standard library's `qsort` and `bsearch`, with custom comparators passed as function pointers. The same callback technique lets a single generic routine apply an operation to every item in an array.

        Cars can be sorted and searched by price, brand, or serial number, and parts can be sorted by price or brand.
      items:
        - title: Searching the Car Inventory
          text: |-
            A car search sorts the inventory by the chosen key and then runs a binary search. The dashboard highlights the match in the table.
          media:
            - src: 02-cars-search.png
              alt: "Car inventory table sorted by serial number, with one car highlighted and a status line reporting that it was found with bsearch"
              caption: The car inventory sorted by serial number, with the search result highlighted.
        - title: Sorting the Parts Inventory
          text: |-
            The parts inventory is sorted with the same comparator approach, by price or brand.
          media:
            - src: 05-parts.png
              alt: "Parts inventory table sorted by brand, listing each part's serial number, name, brand, manufacturer, size and price"
              caption: The parts inventory sorted by brand.

    - id: architecture
      title: Modular Architecture and System Operations
      text: |-
        The system is organized into separate C modules, each with its own source file, header, and responsibility.

        - **Inventory:** Managing cars and spare parts.
        - **Customers and purchases:** Customer records and their purchase histories.
        - **Garages:** Partner garage records.
        - **Store management:** The central structure that holds every collection and coordinates store-level operations such as sales.
        - **File persistence:** Saving and loading the complete store.
        - **User interfaces:** The terminal dashboard and the classic menu, which share the same core operations.

    - id: persistence
      title: Text and Binary File Persistence
      text: |-
        The complete store, including customers' purchase histories and partner garages, can be saved and loaded in two formats.

        - **Text format:** A readable, comma-separated file.
        - **Binary format:** Records written in binary form, with variable-length text stored alongside its length.

        Loading frees the current data and rebuilds the arrays, linked lists, and dynamically allocated strings from the file.

    - id: interaction
      title: System Interaction
      text: |-
        The system runs in the terminal through an interactive dashboard or a classic numbered menu, both with access to inventories, customers, sales, garages, and file operations. The dashboard uses ANSI escape sequences for its presentation and includes a stock chart.

        The dashboard validates customer IDs, prices, and text fields before they reach the store's data.
      media:
        - src: 04-sell.png
          alt: "Sell screen after a sale: the steps of a new sale, the customer's updated purchase list with two cars and a total, and a confirmation message"
          caption: A sale moves a car from the inventory into the customer's purchase history.

    - id: technology
      title: Technology & Methodology
      tools:
        - name: C
          use: The entire system, compiled with GCC.
        - name: Dynamic Memory Management
          use: "malloc, realloc, and free, with clear ownership of every record and string."
        - name: Pointers
          use: Arrays of pointers, pointers to pointers, and void pointers for generic data.
        - name: Linked Lists
          use: Doubly linked purchase histories and a singly linked list of garages.
        - name: Function Pointers & Callbacks
          use: Comparators for sorting and searching, and a generic function applied to every element.
        - name: Sorting & Searching
          use: qsort and bsearch over the inventories.
        - name: File I/O
          use: Text and binary persistence of the complete store.

    - id: source-code
      title: Explore the Source Code
      text: |-
        Explore the modules, data structures, memory handling, comparators, and file persistence code, along with the terminal dashboard and the classic menu.
      links:
        - label: View Source Code on GitHub
          url: https://github.com/shahar-eliyahu/Car-Management-C-Project
---
