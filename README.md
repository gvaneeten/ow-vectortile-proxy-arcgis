# ow-vectortile-proxy-arcgis

Het Digitaal Stelsel Omgevingswet (DSO) ondersteunt de uitvoering van de Omgevingswet. Via het open stelsel kunnen partijen aansluiten en data bevragen via de beschikbare APIs.

Om data te kunnen visualiseren op de kaart, wordt een vector tile laag aangeboden via pdok.nl.
Deze vector tile service voldoet aan de OGC WMTS specificaties, echter deze standaard wordt nog niet ondersteund in de ESRI ArcGis producten.

Dit project is een proxy waarmee metadata wordt ontsloten conform de ESRI Vector tile Rest API urls, waardoor de Omgevingswet Vector tileservice kan worden gebruikt binnen ArcGis producten.

