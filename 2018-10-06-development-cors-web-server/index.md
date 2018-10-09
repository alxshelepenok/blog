# Разработка CORS веб-сервера на Go

![](https://cdn-images-1.medium.com/max/800/1*JeCfi5fiSvCJcNg0dMLC2Q.png)

В разработке прогрессивных web-приложений часто поднимается вопрос о
кросс-доменных запросах. Это довольно обширный вопрос, который нередко может
послужить причиной для чтения Википедии
([CORS](https://ru.wikipedia.org/wiki/Cross-origin_resource_sharing),
[JSONP](https://ru.wikipedia.org/wiki/JSONP)). Кроме этого, существует много
других тематических статей.

Я же постараюсь ударить по нескольким ключевым моментам, а так же покажу как
быстро написать CORS веб-сервер на Golang.

Существует, как минимум, два способа это сделать. Первый способ — использовать
JSONP, второй — CORS.

![](https://cdn-images-1.medium.com/max/800/1*qG1t-ImyWIKZ5mPti4zgwg.jpeg)

### JSONP

> **JSONP** или **«JSON with padding»** — это дополнение к базовому формату JSON.
> Он предоставляет способ запросить данные с сервера, находящегося в другом домене
— операцию, запрещённую в типичных веб-браузерах из-за политики ограничения
домена.

Обозначим преимущества JSONP:

* Поддержка старыми браузерами.

А так же минусы:

* Проблемы с кешированием. Каждый запрос к JSONP должен быть динамичным, даже если
используется Memcached.
* JSONP поддерживает только метод GET. В тоже время CORS позволяет использовать
все возможные методы.

### CORS

> **Cross-origin resource sharing** (CORS, «совместное использование ресурсов
> между разными источниками») — технология современных браузеров, которая
позволяет предоставить веб-странице доступ к ресурсам другого домена.

Преимущества CORS:

* Можно использовать все преимущества **XMLHttpRequest**.
* Нет риска инъекции.
* Легко кешировать.
* Легко в реализации.

Минусы:

Технология не поддерживается в таких браузерах, как IE <= 9, Opera <12 или
Firefox 3.5.

Поэтому, если вам нужна полноценная поддержка IE <= 9, Opera <12 или Firefox 3.5
или любых других старых браузеров, где CORS отсутствует, то используйте JSONP.
Хотелось бы добавить , что в IE8 и IE9 всё таки есть поддержка CORS, но с
нюансами (см.
[blogs.msdn.com](http://blogs.msdn.com/b/ieinternals/archive/2010/05/13/xdomainrequest-restrictions-limitations-and-workarounds.aspx)).

### Немного кода

Разберем пример на языке Go, в котором происходит получение списка репозиториев
из Github.

Выполнив `go get github.com/unrolled/render`, пропишем импорт необходимых
пакетов.

    package main

    import (
     “net/http”
     “encoding/json”
     “github.com/unrolled/render”
    )

Добавим константу `GITHUB_API_REPOS` (URL для доступа к Github API).

    const (
     GITHUB_API_REPOS string = “
    "
    )

В качестве примера, так же добавим новую структуру `Repos`, которая содержит имя
и описание репозитория.

    type Repos struct {
     Name string `json:”name”`
     Description string `json:”description”`
    }

Функция `getJson` необходима для декодирования JSON. На входе тип `interface{}`
и URL типа `string`. Используем Decode вместо Unmarshal, так как Decode умеет
читать из потока.

    func getJson(this interface{}, url string) error {
     res, err := http.Get(url)
     if err != nil {
     return err
     }
     defer res.Body.Close()

    return json.NewDecoder(res.Body).Decode(this)
    }

Функция `setDefaultsHeaders` необходима для установки заголовков в ответ.

В **Access-Control-Allow-Origin** и **Access-Control-Allow-Methods** возможно
разрешить доступ с определенных доменов или установить разрешенные методы.

    func setDefaultHeaders(w http.ResponseWriter) {
     w.Header().Set(“Access-Control-Allow-Origin”, “*”)
     w.Header().Set(“Access-Control-Allow-Methods”, “GET”)
     w.Header().Set(“Cache-Control”, “no-store, no-cache, must-revalidate, post-check=0, pre-check=0”)
     w.Header().Set(“Content-Type”, “application/json; charset=UTF-8”)
     w.Header().Set(“Vary”, “Accept-Encoding”)
    }

В функции `main`, как правило, вызов других функций, рендеринг и запуск
веб-сервера.

    func main() {
     render := render.New()
     mux := http.NewServeMux()

    mux.HandleFunc(“/”, func(w http.ResponseWriter, r *http.Request) {
     setDefaultHeaders(w)

    repos := new([]Repos)

    url := GITHUB_API_REPOS
     getJson(repos, url)

    render.JSON(w, http.StatusOK, repos)
     })

    http.ListenAndServe(“:8000”, mux)
    }

Если все сделать правильно и запустить веб-сервер с помощью команды `go run
server.go`, то мы получим список репозиториев с Name и Description на локальном
хосте под портом 8000.

На этом всё, надеюсь этот код натолкнул вас на мысли.

Если хотите сохранить код на будущее, то его можно найти в [Github
Gist](https://gist.github.com/alxshelepenok/aad6e11226563e6e52c3696fc8edd1c2).
