---
title: Caterpillar Game
subtitle: Bare-Metal C on a PIC32 Microcontroller
summary: >-
  An arcade game written in bare-metal C for a PIC32 microcontroller on the
  Digilent Basys MX3 board. A caterpillar crawls along a character LCD, eating
  apples, collecting hearts, and dodging butterflies, while the firmware drives
  the board's peripherals directly: timer interrupts for game timing, input, and
  sound, the ADC for live speed control, and LEDs, a 7-segment display, an RGB
  LED, and a buzzer for feedback.
type: Embedded Firmware Project
categories: [embedded-systems]
technologies: [C, PIC32, Bare-Metal, Interrupts & Timers, ADC, MPLAB X, XC32]

order: 7.6

links:
  github: https://github.com/shahar-eliyahu/pic32-caterpillar-game
  video: demo.mp4

# Explorer gallery. Media: src/assets/projects_media/pic32-caterpillar-game/
# Landscape photos of the board from the repository's docs/, shown whole (`fit: contain`),
# then the demo video (links.video, played in place, with gameplay.jpg as its poster).
# docs/screenshots/game-over.jpg is left out (owner decision: its LCD message names a person).
videoPoster: gameplay.jpg
cover:
  src: gameplay.jpg
  alt: "Basys MX3 board running the game: the caterpillar on the green character LCD, the score 0001 on the 7-segment display, the RGB LED lit green, five green health LEDs, and the 4x4 keypad module beside the board"
  fit: contain
gallery:
  - src: health.jpg
    alt: "Basys MX3 board during play, with the score 0007 on the 7-segment display, the RGB LED lit pink, green health LEDs, and a finger pressing a key on the attached keypad"
    fit: contain

# Detail page: /projects/pic32-caterpillar-game/. Copy was checked against the
# pic32-caterpillar-game repository (commit 5db448d; the GitHub commit e6c04eb
# only changes the README's video link). ssd.c, rgbled.c and config.h are
# Digilent library files.
detailPage: true
caseStudy:
  sections:
    - id: overview
      title: Project Overview
      text: |-
        The Caterpillar Game is an arcade-style game written in bare-metal C for the PIC32MX370F512L microcontroller on the Digilent Basys MX3 board. It runs without an operating system: the firmware configures the microcontroller's timers, interrupts, ADC, and I/O pins directly at the register level.

        It was developed as the final project for an embedded systems course at Afeka College of Engineering.
      media:
        - video: demo.mp4
          title: Caterpillar Game demo on the Basys MX3 board
          poster: gameplay.jpg

    - id: gameplay
      title: How the Game Works
      text: |-
        Apples, hearts, and butterflies scroll toward the caterpillar on one of the LCD's two rows, and the player switches rows to catch or avoid them. Each round picks the next object at random, with apples and butterflies more common than hearts.

        - **Apple:** adds a point to the score on the 7-segment display.
        - **Heart:** restores one health point, up to eight.
        - **Butterfly:** costs one health point.

        Health is shown as a bar on the board's eight LEDs, and each event is confirmed with a color on the RGB LED and a short sound effect. The game ends when health reaches zero. Players control the game with the keypad or the board's push buttons, set the starting health with the slide switches, and adjust the speed at any time with the potentiometer.
      media:
        - src: health.jpg
          alt: "Basys MX3 board during play, with the score 0007 on the 7-segment display, the RGB LED lit pink, green health LEDs, and a finger pressing a key on the attached keypad"
          caption: Collecting a heart restores health, with feedback on the RGB LED.

    - id: hardware
      title: Hardware & Peripherals
      text: |-
        The game uses the board's display, input, and output peripherals, plus an external keypad module.

        | Peripheral | Role in the game |
        |---|---|
        | 16x2 character LCD | Game screen, with custom characters |
        | 4x4 keypad (Pmod KYPD) | Main controls |
        | Push buttons | Alternative controls |
        | Potentiometer (ADC) | Game speed, adjustable during play |
        | Slide switches | Starting health, read at startup |
        | 8 LEDs | Health bar |
        | 4-digit 7-segment display | Score |
        | RGB LED | Event feedback |
        | Buzzer | Sound effects |

        The 7-segment display and RGB LED drivers and the board's pin definitions come from Digilent's Basys MX3 library.

    - id: firmware
      title: Interrupt-Driven Firmware Design
      text: |-
        The firmware is driven by timer interrupts. After initializing the peripherals, the main loop only reads the potentiometer and adjusts the game speed, while the game itself runs in three interrupt routines with separate priorities. The Digilent 7-segment driver adds its own timer interrupt to refresh the display.
      items:
        - title: Game Tick
          text: |-
            Timers 2 and 3 are chained into one 32-bit timer whose interrupt advances the game: it moves the current object, checks for collisions, animates the caterpillar, redraws the LCD, and updates the score.
        - title: Input and RGB LED
          text: |-
            A Timer 5 interrupt scans the keypad and push buttons, and drives the RGB LED colors with pulse-density modulation.
        - title: Sound
          text: |-
            A Timer 4 interrupt, at a higher priority than the game tick, toggles the buzzer pin at the requested frequency. Each sound effect is a short sequence of tones.
        - title: Speed Control with the ADC
          text: |-
            The main loop samples the potentiometer through the ADC and maps the reading linearly to the game timer's period. A small threshold ignores ADC noise, so the speed changes only when the knob actually moves.
        - title: Custom LCD Characters
          text: |-
            Seven 5x8 characters are written to the LCD's character memory, including two caterpillar frames that alternate on each tick to animate its crawl.

    - id: technology
      title: Technology & Methodology
      tools:
        - name: C (Bare-Metal)
          use: Firmware with direct register access, without an operating system.
        - name: PIC32
          use: The PIC32MX370F512L microcontroller on the Digilent Basys MX3 board.
        - name: Interrupts & Timers
          use: Three timer interrupts for the game tick, input, and sound.
        - name: ADC
          use: Potentiometer readings for live speed control.
        - name: MPLAB X & XC32
          use: Development, building, and programming the board.

    - id: source-code
      title: Explore the Source Code
      text: |-
        Explore the game logic, interrupt routines, and peripheral drivers in the repository.
      links:
        - label: View Source Code on GitHub
          url: https://github.com/shahar-eliyahu/pic32-caterpillar-game
---
