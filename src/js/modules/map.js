export default class {
    constructor(selector, setting) {
        this.map = this.init(selector, setting);
    }

    init(selector, setting) {
        var map = new ymaps.Map(selector, setting);

        this.clusterer = new ymaps.Clusterer({
            clusterDisableClickZoom: true,
            clusterOpenBalloonOnClick: true,
            // Устанавливаем стандартный макет балуна кластера "Карусель".
            clusterBalloonContentLayout: 'cluster#balloonCarousel',
            // Устанавливаем режим открытия балуна.
            // В данном примере балун никогда не будет открываться в режиме панели.
            clusterBalloonPanelMaxMapArea: 0,
            // Устанавливаем размеры макета контента балуна (в пикселях).
            clusterBalloonContentLayoutWidth: 200,
            clusterBalloonContentLayoutHeight: 130,
            // Устанавливаем максимальное количество элементов в нижней панели на одной странице
            clusterBalloonPagerSize: 5
            // Настройка внешнего вида нижней панели.
            // Режим marker рекомендуется использовать с небольшим количеством элементов.
            // clusterBalloonPagerType: 'marker',
            // Можно отключить зацикливание списка при навигации при помощи боковых стрелок.
            // clusterBalloonCycling: false,
            // Можно отключить отображение меню навигации.
            // clusterBalloonPagerVisible: false
        });
        map.geoObjects.add(this.clusterer);

        return map;
    }

    on(type, handler) {
        this.map.events.add(type, handler.bind(this));
    }

    async geocoder(coords) {
        const response = await ymaps.geocode(coords);
        const data = response.geoObjects.get(0).properties.get('metaDataProperty').GeocoderMetaData.text;

        return data;
    }

    createPlacemark(coords, setting, event) {
        var placemark = new ymaps.Placemark(coords, setting);

        if (event) {
            placemark.events.add(event.type, event.handler.bind(this))
        }
        this.clusterer.add(placemark);
    }
}