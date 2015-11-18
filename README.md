# Alkalmazások fejlesztése - ReceptKönyv
- [Leírás](https://www.github.com/geguabi/cookbook#leírás)
- [Követelmények](https://www.github.com/geguabi/cookbook#követelmények)
- [Technológiák](https://www.github.com/geguabi/cookbook#technológiák)
- [Modellek](https://www.github.com/geguabi/cookbook#modellek)
- [Folyamatok](https://www.github.com/geguabi/cookbook#folyamatok)
- [Végpontok] (https://www.github.com/geguabi/cookbook#végpontok)
- [Felhasználói interfész](https://www.github.com/geguabi/cookbook#interfész)
- [Tesztelés](https://www.github.com/geguabi/cookbook#tesztek)


##Leírás
Ez a projekt az ELTE-IK programtervező informatikus Bsc szak Alkalmazások fejlesztése tárgy első
beadandója. Egy receptek tárolására szolgáló alkalmazást készítettem, ahol regisztráció, majd belépés után a felhasználó recepteket rögzíthet, illetve
a hozzávalókat és elkészítésük menetét rögzítheti az adott recept alá. Mivel egy étel többféle képpen is elkészíthető, ezért egy recept alá több elkészítési mód is rögzíthető.

##Követelmények
Funkcionális elvárások
 * Felhasználóként szeretnék felvinni egy receptet, leírással és képpel --> Recept felvitele
 * Felhasználóként szeretnék hozzávalókat és elkészítési módokat csatolni a felvitt receptekhez
 * Legyen lehetőségem módosítani és törölni az adott receptet
 
Nem funkcionális követelmények
 * Felhasználóbarát, ergonomikus elrendezés és kinézet.
 * Gyors működés.
 * Biztonságos működés: jelszavak tárolása, funkciókhoz való hozzáférés.
 * 
##Technológiák
A project főleg javascripten alapuló technológiák segítségével íródott. A megjelenítéshez a handlebars fájlok
és a superhero Bootswatch téma felelnek. 
A használt node modulok listája:
 
 * bcryptjs
 * body-parser
 * chai
 * connect-flash
 * express
 * express-session
 * express-validator
 * hbs
 * mocha
 * passport
 * passport-local
 * sails-disk
 * sails-memory
 * waterline
 * zombie


##Modellek
![Adatbázis modell](https://cloud.githubusercontent.com/assets/14271837/11242913/2a419f02-8e05-11e5-8eeb-e5680734b39c.png)


Itt egy kép látható az adatbázis modellről. A user modell tükrözi a felhasználót akinek egy egyedi adattagja van,
a felhasználónév, tehát két ugyanolyan felhasználó nem szerepelhet az adatbázisban.
Egy felhasználóhoz több recept is tartozhat, illetve egy recepthez több hozzávalólista/elkészítés kapcsolódhat

##Folyamatok
![Folyamatdiagram] (https://github.com/geguabi/cookbook/blob/master/documentation/activity_d.png)

##Végpontok
 * GET /: főoldal
 * GET /help: leírás a használatról
 * GET /login: bejelentkező oldal
 * POST /login: bejelentkezési adatok felküldése
 * GET /recipes/list: recept lista oldal
 * GET /recipes/new: új recept felvitele
 * POST /recipes/new: új recept felvitele, adatok küldése
 * GET /recipes/:id: recept adatai, hozzávalók, elkészítés listázása
 * POST /recipes/:id: új hozzávalók, elkészítés felvitele
 * GET /update:id: recept módosítása oldal
 * POST /update:id: módosított recept adatainak felküldése
 * GET /delete:id: recept törlése
 
##Interfész
![Interfész](https://github.com/geguabi/cookbook/blob/master/documentation/page_view.png)

A bal felső sarokban szerepel az alkalmazás neve, amelyre kattintva a weboldalaknál megszokottan a főoldalra irányít.
Ha nem vagyunk bejelentkezve, akkor jobb felső sarokban lehet a bejelentkezés gombra kattintani, ami átvisz a login oldalra.
Ezen az oldalon lehet a regisztrálás is, ami a login/signup végponton keresztül a regisztrációs oldalra visz. A regisztráció értelemszerű.
Ezt követően válik elérhetővé a receptek listaoldala. A felvitt receptekhez elkészítési módokat, hozzávalókat a táblázatban megadott gombok segítsével lehet.
Ugyanitt törölhetők a receptek is.


##Tesztek


Két fő tesztelési metódust használtam a feladatban.

* Az első az egy mocha/chai típusú tesztelés a user.test.js fájlban. Ez teszteli azt, hogy egy modelt létre lehet-e hozni,
hogy később megtalálható legyen az adatbázisban módosítás, vagy törlés céljából.

* A másik egy funcionális tesztelés volt, aminek keretében kézzel beirogatva, végpontokat ellenőrízve teszteltem, hogy az alkalmazás az elvárt módon működik-e

##Fejlesztés és felhasználás


A project a Cloud9 webes felüleletén készült Windows operációs rendszer alatt.
Futtatáshoz, továbbfejlesztéshez le kell tölteni a projectet és Cloud9-ba vagy saját fejlesztőrendszerbe bemásolni és telepíteni
a függőségeket (lsd. Technológiák pontot).
Az alkalmazás futtatható Heroku alatt is: https://ggcookbook.herokuapp.com

A fejlesztés zökkenőmentes menetéhez szükség lesz 2GB memóriára és valamilyen 2 magos processzorra minimum.


##Funkció lista 


- Regisztráció, login oldal működik, a jelszó bcrypt-el kódolva kerül az adatbázisba
- A neptun kód egyedi, csak egy lehet mindegyikből, ha ez nem teljesül, akkor hibát jelez a program
- session működik
- Listázó oldal müködik, az összes recept látható.
- Hozzávalók, elkészítési módok hozzáadása elérhető
- Szerkesztés/Törlés funkció müködik

További fejlesztési lehetőség:
- többféle tesztelési és validációs lehetőség implementálása
- többféle felhasználói szerepkör megvalósítása (pl.: legyenek adminok, törölni-módosítani csak a receptet rögzített user tudja stb)
