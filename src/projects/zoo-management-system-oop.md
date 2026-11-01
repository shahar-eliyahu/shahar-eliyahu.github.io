---
title: Zoo Management System
subtitle: Object-Oriented Design in Java with a Swing Dashboard
summary: >-
  A Java zoo simulation built around object-oriented design: several class
  hierarchies, interfaces, enums, custom comparators, and hand-written data
  structures, including a binary search tree and sorted linked lists. Animals
  age, lose happiness, and leave the zoo over simulated years. The original
  console application was later extended with a Swing dashboard built on the
  same zoo interface.
type: Object-Oriented Programming Project
categories: [software-engineering]
technologies: [Java, Swing, Java2D, OOP, Data Structures]

order: 8

links:
  github: https://github.com/shahar-eliyahu/Zoo-OOP-Java-Project

# Explorer gallery. Media: src/assets/projects_media/zoo-management-system-oop/images/
# Landscape dashboard screenshots, shown whole (`fit: contain`). Only the eight
# screenshots below are used; the other four in the folder stay unreferenced.
cover:
  src: 01-overview.png
  alt: "Dashboard overview for year 1: summary cards for all animals, penguins, lions, tigers, eagles, cats, fish and megalodons, bar charts of population and average happiness by group, and the aquarium's color mix"
  fit: contain
gallery:
  - src: 06-aquarium.png
    alt: "Aquarium screen: an animated tank of gold, clown and aquarium fish drawn in their own colors and patterns, above a table of every fish's type, colors, pattern, age, length, daily food and happiness"
    fit: contain
  - src: 05-cats.png
    alt: "Cats screen: a table of the cats in in-order traversal, sorted by age, next to the binary search tree drawn as stored, a long unbalanced shape"
    fit: contain
  - src: 02-penguins.png
    alt: "Penguins screen sorted by height: a numbered table of nine penguins with age, height and happiness, the tallest marked as leader, and buttons to sort by name, height or age"
    fit: contain

# Detail page: /projects/zoo-management-system-oop/. All copy is owner-approved and
# was checked against the Zoo-OOP-Java-Project repository (commit ab2c880).
detailPage: true
caseStudy:
  sections:
    - id: overview
      title: Project Overview
      text: |-
        The Zoo Management System is a Java simulation developed as a final project for an object-oriented programming course. It models a zoo with penguins, lions, tigers, eagles, cats, three kinds of fish, and a megalodon, and lets the user add animals, feed them, listen to them, and move the simulation forward year by year.

        Each year every animal ages and loses some happiness. Feeding restores it, and an animal leaves the zoo when it passes its life span or its happiness drops to zero.

        The original project was a console application. A Swing dashboard was later added that works only through the same `ZooInterface`, so every number on screen comes from the project's own classes and data structures.
      media:
        - src: 01-overview.png
          alt: "Dashboard overview for year 1: summary cards for all animals, penguins, lions, tigers, eagles, cats, fish and megalodons, bar charts of population and average happiness by group, and the aquarium's color mix"
          caption: "The dashboard overview: population and average happiness for each animal group, and the aquarium's color mix."

    - id: design
      title: Object-Oriented Design
      text: |-
        - **Inheritance:** `AnimalAbstract` is the base of every animal. Predators extend `PredatoryAnimalsAbstract`, eagles add a further `PredatoryBird` level, and the three fish types extend `FishAbstract`.
        - **Interfaces:** A shared animal interface defines `feed()`, `ageOneYear()`, and `makeNoise()`. Each data structure has its own interface, and both front ends depend only on `ZooInterface`.
        - **Polymorphism:** Feeding the zoo and listening to it call each animal's own `feed()` and `makeNoise()` implementation.
        - **Enums:** Eagle types, fish colors, and fish body patterns.
        - **Singleton:** The zoo is created once through `Zoo.getZooInstance`.
        - **Custom exceptions:** `ExceptionZoo` carries a title and a description, and is used to reject invalid animals.

    - id: data-structures
      title: Hand-Written Data Structures
      items:
        - title: Cats in a Binary Search Tree
          text: |-
            Cats are stored in a binary search tree keyed by age. The dashboard draws the tree exactly as it is stored, next to an in-order traversal. The tree is not self-balancing, so its shape depends on the order the cats were added.
          media:
            - src: 05-cats.png
              alt: "Cats screen: a table of the cats in in-order traversal, sorted by age, next to the binary search tree drawn as stored, a long unbalanced shape"
              caption: The cats' binary search tree as stored, next to its in-order traversal.
        - title: Penguins in a Sorted Linked List
          text: |-
            Penguins are kept in a sorted linked list. The sorting strategy can be switched at runtime between name, height, and age, and the list is rebuilt in the new order.
          media:
            - src: 02-penguins.png
              alt: "Penguins screen sorted by height: a numbered table of nine penguins with age, height and happiness, the tallest marked as leader, and buttons to sort by name, height or age"
              caption: The penguin linked list sorted by height, with the tallest penguin leading the group.
        - title: Eagle Packs and Comparators
          text: |-
            Eagles are split into three packs by type, each its own linked list. Every pack is ordered by a chain of comparators: speed, then age, then top altitude.
          media:
            - src: 04-eagles.png
              alt: "Eagles screen with three tables for the bald, golden and black eagle packs, each listing its eagles with speed, age, top altitude, weight and happiness"
              caption: The three eagle packs, each ordered by speed, then age, then top altitude.

    - id: dashboard
      title: The Swing Dashboard
      text: |-
        The dashboard is built with Swing and custom Java2D drawing, with no external libraries. It has a screen for every animal group, and actions for feeding the zoo, listening to the animals, moving to the next year, and adding animals.

        The add-animal form uses the same limits and constructors as the console version, so invalid animals are rejected with the project's own `ExceptionZoo` messages.

        The aquarium is animated: every fish is drawn with its own colors, body pattern, and size, taken from the fish objects in the zoo.

        The dashboard also has a built-in screenshot mode that saves an image of every screen and dialog.
      media:
        - src: 06-aquarium.png
          alt: "Aquarium screen: an animated tank of gold, clown and aquarium fish drawn in their own colors and patterns, above a table of every fish's type, colors, pattern, age, length, daily food and happiness"
          caption: The animated aquarium. Each fish is drawn from its own colors, pattern, and length.
      items:
        - title: Dashboard Actions
          media:
            - src: 08-add-animal.png
              alt: "Add an animal dialog for an aquarium fish, with fields for length, age and pattern, color checkboxes, and Cancel and Add to the zoo buttons"
              caption: The add-animal form, validated with the same rules as the console version.
            - src: 10-next-year.png
              alt: "Welcome to year 2 dialog listing, for each animal group, the animals that left the zoo and their age"
              caption: "Moving to the next year: the animals that left the zoo because of age or low happiness."
            - src: 09-feeding.png
              alt: "Feeding time dialog with a table of each animal group's food amount and unit, calculated by each animal's feed() method"
              caption: Feeding time, with each group's food calculated by its own feed() method.

    - id: technology
      title: Technology & Methodology
      tools:
        - name: Java
          use: Core simulation and object-oriented design.
        - name: Swing & Java2D
          use: Desktop dashboard with custom drawing and animation.
        - name: Data Structures
          use: A binary search tree and sorted linked lists, written from scratch.
        - name: Comparators
          use: Sorting by age, name, speed, and top altitude.
        - name: Enums & Custom Exceptions
          use: Typed animal attributes and validation.

    - id: source-code
      title: Explore the Source Code
      text: |-
        Explore the class hierarchies, interfaces, data structures, and comparators, along with the console application and the Swing dashboard.
      links:
        - label: View Source Code on GitHub
          url: https://github.com/shahar-eliyahu/Zoo-OOP-Java-Project
---
