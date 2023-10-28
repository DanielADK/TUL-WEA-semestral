# TODO list (CZ)
Semestrální práce k předmětu NTI/WEA na Fakultě mechatroniky, informatiky a mezioborových studií (FM) na Technické 
univerzitě v Liberci (TUL).

## O práci
Projekt je webová aplikace pro správu úkolů (Todo List), která je určena jak pro individuální uživatele. Aplikace je 
napsána ve Vue.js (frontend) a v Pythonu+Flask (backend). Backend dispouje Dockerfile pro spuštění API v Docker 
kontejneru.

## Funkce
- Přidání, úprava a odstranění úkolů.
- Označení úkolů jako dokončené.
- Filtrování úkolů podle stavu (všechny, dokončené, nedokončené).
- Přihlášení uživatelů.

### Backend (_./_)
- Python 3.8 + Flask.
- RESTful API pro manipulaci s úkoly a přihlášení.
- Používá SQLite pro databázové operace.
- Ošetřuje autentizaci a autorizaci uživatelů.
- Implementuje CORS policy pro zabezpečení.
- Implementuje JWT pro autentizaci.
- Implementuje CRUD operace pro úkoly.

### Frontend (_./static_)
- Vue.js 2.6.11.
- Používá Bootstrap 4.5.3.
- Používá Axios pro komunikaci s backendem (API).
- Používá Vuex pro správu stavu aplikace.
- Používá Vue Router pro správu navigace.
- Implementuje CRUD operace pro úkoly.
- Implementuje autentizaci uživatelů. 

### Bezpečnost
- Uložení hesel uživatelů v databázi je zabezpečeno pomocí hashování a "soli".
- Backend implementuje JWT pro autentizaci.
- Backend implementuje CORS policy pro zabezpečení.
- Ošetřuje vstupní data a ošetřuje XSS a SQL injection.

## Přihlašovací údaje
Pro přístup do aplikace je potřeba se přihlásit. Pro účely testování je možné použít následující údaje:

__URL nasazené verze: https://todo.danieladamek.eu/__

### Účet 1
__Jméno:__ daniel 
__Heslo:__ adamek

### Účet 2
__Jméno:__ tester 
__Heslo:__ tester



## Licence
TODO list © 2023 by Daniel Adámek is licensed under CC BY-NC 4.0. To view a copy of this license, visit http://creativecommons.org/licenses/by-nc/4.0/