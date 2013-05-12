ymaps.ready(init);

function init() {
    var
        friendsGeoObjects = [],
        enemiesGeoObjects = [],
        i, j,
        myMap,
        clientsButton,
        opponentsButton,
        myToolBar,
        opponentsClusterer,
        clientsClusterer;

    myMap = new ymaps.Map("map", {
        // center:[44.934680, 34.091988],
        center:[55.753081, 37.623998],
        zoom:14
    });

    myMap.geoObjects.add(
        new ymaps.Placemark(
            [55.753081, 37.623998],
            {
                hintContent:"Вы тут",
                balloonContentHeader: "Вы тут",
                balloonContent: "Ваше местоположение",
                balloonContentFooter: "ContentFooter"
            }
//            [ymaps.geolocation.latitude, ymaps.geolocation.longitude],
//            {
//                balloonContentHeader:ymaps.geolocation.country,
//                balloonContent:ymaps.geolocation.city,
//                balloonContentFooter:ymaps.geolocation.region
//            }
        )
    );

    myMap.controls.add('smallZoomControl');

    friendsCoordinates = [
        [55.754187,37.627220],
        [55.753897,37.628594],
        [55.753316,37.627564],
        [55.755252,37.623616],
        [55.758979,37.623701],
        [55.755375,37.614861],
        [55.758376,37.614775],
        [55.760409,37.629366],
        [55.758886,37.630310],
    ];

    enemiesCoordinates = [
        [55.760967,37.619496],
        [55.757156,37.610140],
        [55.753913,37.608080],
        [55.752316,37.606449],
        [55.751880,37.622414],
        [55.750815,37.614775],
        [55.757543,37.607737],
        [55.750912,37.625075],
    ];

    for (i = 0; i < friendsCoordinates.length; i++) {
        friendsGeoObjects[i] = new ymaps.GeoObject({
            geometry:{
                type:"Point",
                coordinates:friendsCoordinates[i]
            },
            properties:{
                hintContent:"Клиент #" + (i + 1),
                balloonContentHeader:"Клиент #" + (i + 1),
                balloonContentBody:"Это мой клиент #" + (i + 1)
            }
        }, {
            preset:"twirl#redDotIcon"
        });
    }

    for (j = 0; j < enemiesCoordinates.length; j++) {
        enemiesGeoObjects[j] = new ymaps.GeoObject({
            geometry:{
                type:"Point",
                coordinates:enemiesCoordinates[j]
            },
            properties:{
                hintContent:"Конкурент #" + (j + 1),
                balloonContentHeader:"Конкурент #" + (j + 1),
                balloonContentBody:"Это мой конкурент #" + (j + 1)
            }
        }, {
            preset:"twirl#darkgreenDotIcon"
        });
    }

    opponentsClusterer = new ymaps.Clusterer({
        preset: "twirl#invertedDarkgreenClusterIcons"
    });

    clientsClusterer = new ymaps.Clusterer({
        preset: "twirl#invertedRedClusterIcons"
    });

    myMap.geoObjects.add(clientsClusterer);
    myMap.geoObjects.add(opponentsClusterer);

    // Create Clients button
    clientsButton = new ymaps.control.Button('Клиент');
    clientsButton.events.add('select', function () {
        clientsClusterer.add(friendsGeoObjects);
    });
    clientsButton.events.add('deselect', function () {
        clientsClusterer.remove(friendsGeoObjects);
    });
    clientsButton.state.set('selected', true);

    // Create opponents button
    opponentsButton = new ymaps.control.Button('Конкуренты');
    opponentsButton.events.add('select', function () {
        opponentsClusterer.add(enemiesGeoObjects);
    });
    opponentsButton.events.add('deselect', function () {
        opponentsClusterer.remove(enemiesGeoObjects);
    });
    opponentsButton.state.set('selected', true);

    // Create toolbar
    myToolBar = new ymaps.control.ToolBar();
    myToolBar.add(clientsButton);
    myToolBar.add(opponentsButton);
    myMap.controls.add(myToolBar);
}
