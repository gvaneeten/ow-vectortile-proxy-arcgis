# ow-vectortile-proxy-arcgis

Het Digitaal Stelsel Omgevingswet (DSO) ondersteunt de uitvoering van de Omgevingswet. Via het open stelsel kunnen partijen aansluiten en data bevragen via de beschikbare APIs.

Om data te kunnen visualiseren op de kaart, wordt een vector tile laag aangeboden via pdok.nl.
Deze vector tile service voldoet aan de OGC WMTS specificaties, echter deze standaard wordt nog niet ondersteund in de ESRI ArcGis producten.

Dit project is een proxy waarmee metadata wordt ontsloten conform de ESRI Vector tile Rest API urls, waardoor de Omgevingswet Vector tileservice kan worden gebruikt binnen ArcGis producten.


Deze proxy is gebaseerd op [Express](http://expressjs.com/).

### Lokaal uitvoeren

1. Install [Node.js and npm](https://nodejs.org/)
1. Run `npm install`
1. Run `npm start`
1. De vector tile service is beschikbaar op http://localhost:3000/owvector_pre/VectorTileServer


### Werking

Het endpoint /VectorTileServer serveert de meta data van de vector tile layer. Voor de actuele tiles wordt hier verwezen naar de Omgevingswet vector tile service op PDOK. Let op: De x,y zijn hier omgewisseld.
De specifieke waarden voor de resoluties zijn afgeleid, waarbij rekening is gehouden met het feit dat ArcGis 512x512 tiles nodig heeft, terwijl de OW tiles 256x256 zijn.

Het volledige antwoord:


```json
{
  "currentVersion": 10.81,
  "name": "OWVectortiles",
  "capabilities": "TilesOnly",
  "type": "indexedFlat",
  "defaultStyles": "resources/styles",
  "tiles": [
    "https://service.pdok.nl/omgevingswet/omgevingsdocumenten-pre/wmts/v1_0/locaties/EPSG:28992/{z}/{x}/{y}.pbf"
  ],
  "exportTilesAllowed": false,
  "initialExtent": {
    "xmin": -285401.92,
    "ymin": 71093.0554,
    "xmax": 546906.9446,
    "ymax": 903401.92,
    "spatialReference": {
      "wkid": 28992,
      "latestWkid": 28992
    }
  },
  "fullExtent": {
    "xmin": -285401.92,
    "ymin": 71093.0554,
    "xmax": 546906.9446,
    "ymax": 903401.92,
    "spatialReference": {
      "wkid": 28992,
      "latestWkid": 28992
    }
  },
  "minScale": 0,
  "maxScale": 0,
  "tileInfo": {
    "rows": 512,
    "cols": 512,
    "format": "pbf",
    "origin": {
      "x": -285401.92,
      "y": 903401.92
    },
    "spatialReference": {
      "wkid": 28992,
      "latestWkid": 28992
    },
    "dpi": 96,
    "lods": [
      {
        "level": 0,
        "resolution": 1720.320,
        "scale": 12288000
      },
      {
        "level": 1,
        "resolution": 860.160,
        "scale": 6144000
      },
      {
        "level": 2,
        "resolution": 430.080,
        "scale": 3072000
      },
      {
        "level": 3,
        "resolution": 215.040,
        "scale": 1536000
      },
      {
        "level": 4,
        "resolution": 107.520,
        "scale": 768000
      },
      {
        "level": 5,
        "resolution": 53.760,
        "scale": 384000
      },
      {
        "level": 6,
        "resolution": 26.880,
        "scale": 192000
      },
      {
        "level": 7,
        "resolution": 13.440,
        "scale": 96000
      },
      {
        "level": 8,
        "resolution": 6.720,
        "scale": 48000
      },
      {
        "level": 9,
        "resolution": 3.360,
        "scale": 24000
      },
      {
        "level": 10,
        "resolution": 1.680,
        "scale": 12000
      },
      {
        "level": 11,
        "resolution": 0.840,
        "scale": 6000
      }
    ]
  },
  "resourceInfo": {
    "styleVersion": 8,
    "tileCompression": "gzip",
    "cacheInfo": {
      "storageInfo": {
        "packetSize": 128,
        "storageFormat": "compactV2"
      }
    }
  }
}
```

Het tweede relevante endpoint is dat van de default style, /VectorTileServer/resource/styles.


```json
{
  "version": 8,
  "sprite": "../sprites/spritesheet",
  "glyphs": "../fonts/{fontstack}/{range}.pbf",
  "sprite_ref": "generiek_symbool",
  "sources": {
    "omgevingsdocument": {
      "type": "vector",
      "url": "../../../VectorTileServer"
    }
  },
  
  "layers": [
    {
      "id": "vag215line",
      "type": "line",
      "source": "omgevingsdocument",
      "source-layer": "vlaklocaties",
      "paint": {        
        "line-color": "#009b00",
        "line-opacity": 0.7,
        "line-width": 1.0
      }
    }
  ]
}
```

Deze default style zorgt ervoor dat alle vlaklocaties uit de vector tiles getoond worden. Om nuttig gebruik te kunnen maken van de OW Vector tiles is het nodig om een specifieke mapbox styling te maken / genereren. Daarbij wordt gebruik gemaakt van de apis van het DSO Open stelsel: [*Omgevingsdocument presenteren*](https://aandeslagmetdeomgevingswet.nl/ontwikkelaarsportaal/api-register/api/omgevingsdocument-presenteren/) en [*Omgevingsdocument verbeelden*](https://aandeslagmetdeomgevingswet.nl/ontwikkelaarsportaal/api-register/api/omgevingsdocument-verbeelden/).

Heel globaal zijn de stappen:
1. Bepaal via de presenteren api welke locaties getoond moeten worden.
1. Bepaal vervolgens via de verbeelden API de mapbox styles die hier bij horen
1. Voeg deze samen in een nieuw style.json bestand en gebruik dit bestand als stijl

De features in de vector tiles bevatten slechts identificerende attributen: *identificatie* en *versie*. Via filtering kan de zichtbaarheid worden beperkt tot een set van identificaties. 

In onderstaande voorbeeld wordt alleen het werelderfgoed gebied De Stelling van Amsterdam getoond.

```json
{
        "version": 8,
        "sprite": "https://pre.omgevingswet.overheid.nl/publiek/omgevingsdocumenten/api/verbeelden/v3/spritesheet",
        "sprite_ref": "generiek_symbool",
        "sources": {
            "omgevingsdocument": {
                "type": "vector"
		"url": "../../../VectorTileServer"
            }
        },
        "layers": [
            {
                "id": "vag306-fill",
                "type": "fill",
                "niveau": 0,
                "source": "omgevingsdocument",
                "source-layer": "vlaklocaties",
                "paint": {
                    "fill-pattern": "va306.png",
                    "fill-color": "#808080",
                    "fill-opacity": 1.0
                },
                "filter": [
                    "all",
                    [
                        "==",
                        "identificatie",
                        "nl.imow-mnre1034.gebied.StellingAmsterdam"
                    ],
                    [
                        "==",
                        "versie",
                        1
                    ]
                ]
            },
            {
                "id": "vag306-line",
                "type": "line",
                "niveau": 0,
                "source": "omgevingsdocument",
                "source-layer": "vlaklocaties",
                "paint": {
                    "line-color": "#ff3c82",
                    "line-opacity": 1.0,
                    "line-width": 2.0
                },
                "filter": [
                    "all",
                    [
                        "==",
                        "identificatie",
                        "nl.imow-mnre1034.gebied.StellingAmsterdam"
                    ],
                    [
                        "==",
                        "versie",
                        1
                    ]
                ]
            }
        ]
    }
```


