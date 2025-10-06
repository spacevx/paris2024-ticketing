# Paris 2024 Olympic Games Ticketing Platform

A ticketing system for Paris 2024 Olympic Games events, featuring an admin dashboard, a mobile-friendly customer interface, and a QR code scanner for ticket validation.

## Project Overview

This project is a ticketing solution divided into three main components, allowing administrators to manage events, customers to purchase tickets, and staff to validate entries.

## Project Structure

### Admin
Administrative interface for managing the entire ticketing system.
- Create and manage matches/events
- Manage teams and venues
- Built with **Django** using server-side rendering

### Mobile
Mobile-friendly frontend for end users.
- User registration and authentication
- Browse available events
- Purchase tickets
- View purchased tickets with QR codes
- Communicates with the Django API via REST requests

### Scanner
Mobile-friendly scanner interface for staff and administrators.
- Scan customer QR codes
- Validate ticket authenticity
- Real-time ticket verification
- Communicates with the Django API for validation

## Technologies Used

![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Django](https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=white)
![Django REST Framework](https://img.shields.io/badge/DRF-ff1709?style=for-the-badge&logo=django&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

## Getting Started

Please refer to the [SETUP.md](SETUP.md) file for detailed setup instructions.