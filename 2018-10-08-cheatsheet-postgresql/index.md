# Практичные запросы в PostgreSQL

![](https://cdn-images-1.medium.com/max/800/1*6nFUVGQLCO2yd4nlD5m42Q.jpeg)

Это руководство о запросах в PostgreSQL предназначено для начинающих, а так же
для тех, чьи потребности в администрировании ограничены тривиальными задачами,
такими как развертывание базы данных или экспорт и импорт данных.

### Установка PostgreSQL

* Развернуть Docker-контейнер —
[https://github.com/docker-library/postgres/tree/master/9.4](https://github.com/docker-library/postgres/tree/master/9.4)
* Установить PostgreSQL 9.4 на дистрибутивы семейства RedHat —
[http://www.if-not-true-then-false.com/2012/install-postgresql-on-fedora-centos-red-hat-rhel](http://www.if-not-true-then-false.com/2012/install-postgresql-on-fedora-centos-red-hat-rhel).
* Для остальных дистрибутивов, а так же Mac OS и Windows мануал можно найти на
официальном сайте
[https://www.postgresql.org/download](https://www.postgresql.org/download), он
понятный.

### PSQL и команды

Ниже описаны базовые команды для запуска PSQL, список быстрых и список
распространённых команд. Обратите внимание, что все переменные указаны в виде
`__переменная__`, их необходимо заменить.

#### Соединение

После успешной установки, что бы попасть в консоль, набираем магические слова:

    psql -U postgres

Более расширенный вариант:

    psql -U __username__ -d __database__ -h __hostname__

Не обязательно указывать `__database__` и `__hostname__` так как подключиться
всегда можно потом.

#### Быстрые команды

Большинство из них поддерживают дополнительные параметры и шаблоны поиска.

* `\q`: Выйти из консоли.
* `\c __database__`: Подключиться к выбранной базе данных.
* `\d __table__`: Вывод определенной таблицы, включая тригеры.
* `\dt *.*`: Вывод таблиц из схем.
* `\l`: Вывод всех баз данных.
* `\dn`: Вывод схем.
* `\df`: Вывод функций.
* `\dv`: Вывод представлений.
* `\df + __function__`: Показать функцию как SQL-код.
* `\x`: Показать результаты запроса в альтернативном формате, вместо ASCII-таблиц.

#### Распространённые команды

Их можно выполнять под пользователем postgres в последних версиях PostgreSQL.

В первую очередь это команды для работы с пользователями, бэкапами и данными.

* `createuser __username__` — добавить нового пользователя. Если хотите создать
суперпользователя, то просто запустите команду с ключем `-s`.
* `dropuser __username__` — удалить пользователя.
* `createdb __database__` — создать новую базу данных.
* `dropdb __database__` — удалить базу данных.
* `pg_dump __database__ > __filepath__` — создать бэкап указанной базы данных и
экспортировать в SQL-файл. Возможен запуск с ключами `-a` или `-s`, экспорт
только данных или только схем, соответственно.
* `pg_dumpall > __filepath__` — создать бэкап всех баз данных и экспортировать в
один SQL-файл.
* `pg_restore -d __database__ -a __filepath__` — восстановить базу данных из
бэкапа. Возможен запуск с ключами `-a` или `-s`, импорт только данных или только
схем, соответственно. По умолчанию восстанавливаются только данные.
* `\copy __table__ TO ‘__filepath__’ CSV` — экспортировать таблицу в CSV-файл.
* `\copy __table__(__column1__,__column2__) TO ‘__filepath__’ CSV` —
экспортировать определённые столбцы из таблицы в CSV.
* `\copy __table__ FROM ‘__filepath__’ CSV`: импортировать CSV в таблицу.
* `\copy __table__(__colunml__,__column2__) FROM '__filepath__' CSV`:
импортировать определённые столбцы из CSV в таблицу.
* `psql -f __filepath__ __database__`: запустить SQL-скрипт по отношению к
указанной базе данных. Возможен запуск с ключами `-U` — пользователь, `-D` —
база данных, `-h` — хост и `-f `— файл.

### Удобные запросы

Все запросы имеет смысл поделить на три части: работа с пользователями, работа с
правами и работа с данными.

#### Работа с данными

Создать новую базу данных:

    CREATE DATABASE __database__ WITH OWNER __username__;

Удалить базу данных:

    DROP DATABASE IF EXISTS __database__;

Переименовать базу данных:

    ALTER DATABASE __oldname__ RENAME TO __newname__;

#### Работа с пользователями

Получить список всех пользователей:

    SELECT rolname FROM pg_roles;

Создать нового пользователя:

    CREATE USER __username__ WITH PASSWORD ‘__password__’;

Удалить пользователя:

    DROP USER IF EXISTS __username__;

Изменить пароль для пользователя:

    ALTER ROLE __username__ WITH PASSWORD ‘__password__’;

#### Работа с правами

Предоставить все права пользователю для указанной базы данных:

    GRANT ALL PRIVILEGES ON DATABASE __database__ TO __username__;

Предоставить права на соединение с базой данных:

    GRANT CONNECT ON DATABASE __database__ TO __username__;

Предоставить права на схемы для пользователя:

    GRANT USAGE ON SCHEMA public TO __username__;

Предоставить права на функции для пользователя:

    GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO __username__;

Предоставить права на такие операции, как `SELECT` , `UPDATE`, `INSERT` во всех
таблицах текущей базы данных:

    GRANT SELECT, UPDATE, INSERT ON ALL TABLES IN SCHEMA public TO __username__;

Предоставить права на таблицу в текущей базе данных:

    GRANT SELECT, UPDATE, INSERT ON __table__ TO __username__;

Предоставить права на `SELECT` в определенной таблице текущей базы данных:

    GRANT SELECT ON ALL TABLES IN SCHEMA public TO __username__;

*****

Вы можете открыть новый
[Issue](https://github.com/alxshelepenok/blog/issues/new) на Github, если нашли
ошибку или хотите обсудить какие-либо идеи.