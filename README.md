# woolly-front
The brand new online ticket office for UTC student organizations - user interface

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

First of all, you need to set up the environement. Put yourself in the directory of your choice and follow the following instructions : 

If you don't have it yet, install npm legacy
```
sudo apt-get update
sudo apt-get install nodejs npm
sudo apt install nodejs-legacy
sudo npm install -g n
sudo n stable
```
Bower installation :
```
sudo npm install -g bower
```
Yo installation :
```
sudo npm install -g yo
```
Angular installation :
```
sudo npm install -g generator-angular
```
### Installing

Once you have install all the prerequisites, you can clone this repo

```
git clone https://github.com/obledaym/woolly-front.git
```

Then you will need to go into the woolly-front app

```
cd woolly-front
```

Now you will to build the server, like this :

```
grunt build
```

Finally you can launch the server

```
grunt serve
```

You can now play with the server on [localhost:9000](http://localhost:9000)

## Authors

* **[Aymeric OBLED](https://github.com/obledaym)** - *Initial work*

## License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE.md](LICENSE.md) file for details


