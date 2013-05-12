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

    var center = [55.756757, 37.622212];

    myMap = new ymaps.Map("map", {
        // center:[44.934680, 34.091988],
        center:center,
        zoom:14
    });

    myMap.geoObjects.add(
        new ymaps.Placemark(
            center,
            {
                iconContent:"Я",
                hintContent:"Вы тут",
                balloonContent:"Ваше местоположение"
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
        [55.754187, 37.627220],
        [55.753897, 37.628594],
        [55.753316, 37.627564],
        [55.755252, 37.623616],
        [55.758979, 37.623701],
        [55.755375, 37.614861],
        [55.758376, 37.614775],
        [55.760409, 37.629366],
        [55.758886, 37.630310],
    ];

    enemiesCoordinates = [
        [55.760967, 37.619496],
        [55.757156, 37.610140],
        [55.753913, 37.608080],
        [55.752316, 37.606449],
        [55.751880, 37.622414],
        [55.750815, 37.614775],
        [55.757543, 37.607737],
        [55.750912, 37.625075]
    ];

    for (i = 0; i < friendsCoordinates.length; i++) {
        var point = createPoint(
            friendsCoordinates[i],
            "Клиент #" + (i + 1),
            "Клиент #" + (i + 1),
            "Детальная информация",
            "twirl#darkgreenDotIcon");

        friendsGeoObjects[i] = point;
    }

    for (j = 0; j < enemiesCoordinates.length; j++) {

        var point = createPoint(
            enemiesCoordinates[j],
            "Конкурент #" + (j + 1),
            "Конкурент #" + (j + 1),
            "Детальная информация",
            "twirl#redDotIcon");

        enemiesGeoObjects[j] = point;
    }

    opponentsClusterer = new ymaps.Clusterer({
        preset:"twirl#invertedRedClusterIcons"
    });

    clientsClusterer = new ymaps.Clusterer({
        preset:"twirl#invertedDarkgreenClusterIcons"
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
    clientsButton.select();

    // Create opponents button
    opponentsButton = new ymaps.control.Button('Конкуренты');
    opponentsButton.events.add('select', function () {
        opponentsClusterer.add(enemiesGeoObjects);
    });
    opponentsButton.events.add('deselect', function () {
        opponentsClusterer.remove(enemiesGeoObjects);
    });
    opponentsButton.select();

    // Create toolbar
    myToolBar = new ymaps.control.ToolBar();
    myToolBar.add(clientsButton);
    myToolBar.add(opponentsButton);
    myMap.controls.add(myToolBar);
}

function createPoint(coordinates, hintContent, balloonContentHeader, balloonContentBody, preset) {
    return new ymaps.GeoObject({
        geometry:{
            type:"Point",
            coordinates:coordinates
        },
        properties:{
            hintContent:hintContent,
            balloonContentHeader:balloonContentHeader,
            balloonContentBody:balloonContentBody
        }
    }, {
        preset:preset
    });
}
