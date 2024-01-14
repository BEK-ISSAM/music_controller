Music Room Controller

Overview:
This project is a web application that allows users to control music playback. It uses Django for the backend, Django Rest Framework for API endpoints, and React with Babel and Webpack for the frontend.

Features:

User Authentication: through Spotify API.
Music Control: Users can control music playback, such as play, pause, skip, create, join and vote for skipping.
Real-time Updates: Changes made by one user are instantly reflected on other users' interfaces.
RESTful API: Backend exposes RESTful APIs for seamless communication with the frontend.
Responsive Design: The frontend is designed to work on various screen sizes.

Technologies Used:

Django: Backend framework for building robust web applications.

Django Rest Framework: Toolkit for building Web APIs in Django.

React: JavaScript library for building user interfaces.

Babel: JavaScript compiler for writing next-generation JavaScript.

Webpack: Module bundler for the frontend.

Getting Started:

- Prerequisites
	Node.js installed
	Python and pip (or pipenv) installed

Installation:

- Clone the repository:
	git clone https://github.com/BEK-ISSAM/music_controller.git

Navigate to the project directory:
	cd music-controller-app

Create an environment:
	-use one of these:
	py -m pip venv <environment name> ---> <environment name>/Scripts/activate ---> py -m pip install django
	pipenv install django ---> pipenv shell


Install dependencies:
	pip install -r django-requirements.txt
	npm install (everything from 'react-requirements.txt')

Running the App:
- Run Django migrations:
	py manage.py makemigrations
	py manage.py migrate

- Start the Django development server:
	python manage.py runserver 9000

-Start the React development server:
	npm run dev


Acknowledgments:
Thanks to Django and React teams for making web development enjoyable!
