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
        myCluster;

    myMap = new ymaps.Map("map", {
        // center:[44.934680, 34.091988],
        center:[55.753081, 37.623998],
        zoom:14
    });

//    myMap.geoObjects.add(
//        new ymaps.Placemark(
//            [ymaps.geolocation.latitude, ymaps.geolocation.longitude],
//            {
//                balloonContentHeader:ymaps.geolocation.country,
//                balloonContent:ymaps.geolocation.city,
//                balloonContentFooter:ymaps.geolocation.region
//            }
//        )
//    );

    myMap.controls.add('smallZoomControl');

    friendsCoordinates = [
        [55.750177, 37.595846],
        [55.746691, 37.629835],
        [55.750177, 37.622968],
        [55.756566, 37.610609],
        [55.755598, 37.631895]
    ];

    enemiesCoordinates = [
        [55.753439, 37.621886],
        [55.750489, 37.625372],
        [55.748359, 37.610952],
        [55.744292, 37.645971],
        [55.767331, 37.609922],
        [55.750177, 37.595846]
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

    myCluster = new ymaps.Clusterer();
    myMap.geoObjects.add(myCluster);

    clientsButton = new ymaps.control.Button('Клиент');

    clientsButton.events.add('select', function () {
        myCluster.add(friendsGeoObjects);
    });
    clientsButton.events.add('deselect', function () {
        myCluster.remove(friendsGeoObjects);
    });
    clientsButton.state.set('selected', true);

    opponentsButton = new ymaps.control.Button('Конкуренты');
    opponentsButton.events.add('select', function () {
        myCluster.add(enemiesGeoObjects);
    });
    opponentsButton.events.add('deselect', function () {
        myCluster.remove(enemiesGeoObjects);
    });
    opponentsButton.state.set('selected', true);


    myToolBar = new ymaps.control.ToolBar();
    myToolBar.add(clientsButton);
    myToolBar.add(opponentsButton);
    myMap.controls.add(myToolBar);
}
