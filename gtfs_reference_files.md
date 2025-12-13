# Referencia Completa - General Transit Feed Specification (GTFS)

**Fuente:** [https://gtfs.org/es/documentation/schedule/reference/](https://gtfs.org/es/documentation/schedule/reference/)
**Estado:** Documentación de referencia oficial.

Este documento define el formato y la estructura de los archivos que componen un conjunto de datos GTFS.

---

## Índice de Archivos

1.  **Información de la Agencia y Feed**
    * [agency.txt](#agencytxt)
    * [feed_info.txt](#feed_infotxt)
    * [attributions.txt](#attributionstxt)
    * [translations.txt](#translationstxt)
2.  **Servicios y Rutas**
    * [stops.txt](#stopstxt)
    * [routes.txt](#routestxt)
    * [trips.txt](#tripstxt)
    * [stop_times.txt](#stop_timestxt)
    * [calendar.txt](#calendartxt)
    * [calendar_dates.txt](#calendar_datestxt)
    * [frequencies.txt](#frequenciestxt)
    * [transfers.txt](#transferstxt)
    * [shapes.txt](#shapestxt)
3.  **Tarifas (Fares V1 - Legacy)**
    * [fare_attributes.txt](#fare_attributestxt)
    * [fare_rules.txt](#fare_rulestxt)
4.  **Tarifas Avanzadas (Fares V2)**
    * [fare_media.txt](#fare_mediatxt)
    * [fare_products.txt](#fare_productstxt)
    * [rider_categories.txt](#rider_categoriestxt)
    * [fare_leg_rules.txt](#fare_leg_rulestxt)
    * [fare_leg_join_rules.txt](#fare_leg_join_rulestxt)
    * [fare_transfer_rules.txt](#fare_transfer_rulestxt)
    * [timeframes.txt](#timeframestxt)
5.  **Accesibilidad y Estaciones (Pathways)**
    * [pathways.txt](#pathwaystxt)
    * [levels.txt](#levelstxt)
6.  **Redes y Áreas**
    * [areas.txt](#areastxt)
    * [stop_areas.txt](#stop_areastxt)
    * [networks.txt](#networkstxt)
    * [route_networks.txt](#route_networkstxt)
7.  **Servicios Flexibles (Flex/On-Demand)**
    * [location_groups.txt](#location_groupstxt)
    * [location_group_stops.txt](#location_group_stopstxt)
    * [locations.geojson](#locationsgeojson)
    * [booking_rules.txt](#booking_rulestxt)

---

## 1. Información de la Agencia y Feed

### agency.txt
*Presencia: Obligatorio*
Define una o más agencias de transporte que prestan servicios en este conjunto de datos.

| Campo | Tipo | Presencia | Descripción |
| :--- | :--- | :--- | :--- |
| `agency_id` | ID | Condicional | Identificador único de la agencia. Obligatorio si hay más de una agencia en el feed. |
| `agency_name` | Text | Obligatorio | Nombre completo de la agencia de transporte. |
| `agency_url` | URL | Obligatorio | URL del sitio web de la agencia. |
| `agency_timezone` | Timezone | Obligatorio | Zona horaria de la agencia (ej. `America/Bogota`). |
| `agency_lang` | Language code | Opcional | Código de idioma principal (ISO 639-1). |
| `agency_phone` | Phone | Opcional | Número de teléfono de atención al cliente. |
| `agency_fare_url` | URL | Opcional | URL para la compra de billetes o información de tarifas. |
| `agency_email` | Email | Opcional | Dirección de correo electrónico de atención al cliente. |

### feed_info.txt
*Presencia: Condicionalmente Obligatorio (Recomendado)*
Información sobre el conjunto de datos en sí (editor, versión, vigencia).

| Campo | Tipo | Presencia | Descripción |
| :--- | :--- | :--- | :--- |
| `feed_publisher_name` | Text | Obligatorio | Nombre de la organización que publica el feed (puede ser distinto a la agencia). |
| `feed_publisher_url` | URL | Obligatorio | URL de la organización que publica el feed. |
| `feed_lang` | Language code | Obligatorio | Idioma predeterminado del feed. |
| `default_lang` | Language code | Opcional | Idioma al que se traducen los textos si no se especifica otro. |
| `feed_start_date` | Date | Opcional | Fecha de inicio de validez del feed. |
| `feed_end_date` | Date | Opcional | Fecha de fin de validez del feed. |
| `feed_version` | Text | Opcional | Cadena que indica la versión del dataset. |
| `feed_contact_email` | Email | Opcional | Email de contacto para errores técnicos del feed. |
| `feed_contact_url` | URL | Opcional | URL de contacto para errores técnicos. |

### attributions.txt
*Presencia: Opcional*
Define las atribuciones (créditos) del conjunto de datos.

| Campo | Tipo | Presencia | Descripción |
| :--- | :--- | :--- | :--- |
| `attribution_id` | ID | Opcional | Identificador de la atribución. |
| `agency_id` | ID | Opcional | Agencia a la que aplica la atribución. |
| `route_id` | ID | Opcional | Ruta a la que aplica la atribución. |
| `trip_id` | ID | Opcional | Viaje al que aplica la atribución. |
| `organization_name` | Text | Obligatorio | Nombre de la organización. |
| `is_producer` | Enum | Opcional | 1 si la organización produce los datos. |
| `is_operator` | Enum | Opcional | 1 si la organización opera el servicio. |
| `is_authority` | Enum | Opcional | 1 si la organización es la autoridad de transporte. |
| `attribution_url` | URL | Opcional | URL de la organización. |
| `attribution_email` | Email | Opcional | Email de la organización. |
| `attribution_phone` | Phone | Opcional | Teléfono de la organización. |

### translations.txt
*Presencia: Opcional*
Proporciona traducciones para los textos del feed.

| Campo | Tipo | Presencia | Descripción |
| :--- | :--- | :--- | :--- |
| `table_name` | Enum | Obligatorio | Nombre de la tabla que contiene el campo a traducir. |
| `field_name` | Enum | Obligatorio | Nombre del campo a traducir. |
| `language` | Language code | Obligatorio | Idioma de la traducción. |
| `translation` | Text | Obligatorio | Valor traducido. |
| `record_id` | ID | Condicional | ID del registro (primary key) a traducir. |
| `record_sub_id` | ID | Condicional | ID secundario (ej. `stop_sequence`) para tablas con claves compuestas. |
| `field_value` | Text | Condicional | Valor original del texto a traducir (alternativa a usar IDs). |

---

## 2. Servicios y Rutas

### stops.txt
*Presencia: Obligatorio*
Paradas, estaciones o entradas de estaciones.

| Campo | Tipo | Presencia | Descripción |
| :--- | :--- | :--- | :--- |
| `stop_id` | ID | Obligatorio | ID único de la parada. |
| `stop_code` | Text | Opcional | Código corto público (visible para pasajeros). |
| `stop_name` | Text | Condicional | Nombre de la parada. Obligatorio para paradas y estaciones. |
| `stop_desc` | Text | Opcional | Descripción de la parada. |
| `stop_lat` | Latitude | Condicional | Latitud. Obligatorio para ubicaciones físicas. |
| `stop_lon` | Longitude | Condicional | Longitud. Obligatorio para ubicaciones físicas. |
| `zone_id` | ID | Opcional | ID de zona tarifaria. |
| `stop_url` | URL | Opcional | URL específica de la parada. |
| `location_type` | Enum | Opcional | 0=Parada/Andén, 1=Estación, 2=Entrada/Salida, 3=Nodo genérico, 4=Área de embarque. |
| `parent_station` | ID | Condicional | ID de la estación principal (para entradas o andenes). |
| `stop_timezone` | Timezone | Opcional | Zona horaria si difiere de la agencia. |
| `wheelchair_boarding` | Enum | Opcional | 0=Info desconocida, 1=Accesible, 2=No accesible. |
| `level_id` | ID | Opcional | ID del nivel (piso) donde está la parada (ver `levels.txt`). |
| `platform_code` | Text | Opcional | Identificador de andén/plataforma (ej. "Andén 2"). |

### routes.txt
*Presencia: Obligatorio*
Rutas de transporte.

| Campo | Tipo | Presencia | Descripción |
| :--- | :--- | :--- | :--- |
| `route_id` | ID | Obligatorio | Identificador único de la ruta. |
| `agency_id` | ID | Condicional | Agencia que opera la ruta (obligatorio si hay múltiples agencias). |
| `route_short_name` | Text | Condicional | Nombre corto (ej. "M1", "32"). Al menos uno de los nombres es obligatorio. |
| `route_long_name` | Text | Condicional | Nombre largo (ej. "Centro - Aeropuerto"). |
| `route_desc` | Text | Opcional | Descripción de la ruta. |
| `route_type` | Enum | Obligatorio | Tipo de vehículo (0=Tranvía, 1=Metro, 2=Tren, 3=Bus, etc.). |
| `route_url` | URL | Opcional | URL de la ruta. |
| `route_color` | Color | Opcional | Color de la ruta (hexadecimal sin #). |
| `route_text_color` | Color | Opcional | Color del texto sobre el color de la ruta. |
| `route_sort_order` | Integer | Opcional | Orden para mostrar las rutas en listas. |
| `continuous_pickup` | Enum | Opcional | Si se permite subir en cualquier punto de la ruta. |
| `continuous_drop_off` | Enum | Opcional | Si se permite bajar en cualquier punto de la ruta. |
| `network_id` | ID | Opcional | ID de la red a la que pertenece la ruta. |

### trips.txt
*Presencia: Obligatorio*
Viajes individuales que ocurren en una ruta.

| Campo | Tipo | Presencia | Descripción |
| :--- | :--- | :--- | :--- |
| `route_id` | ID | Obligatorio | Referencia a `routes.txt`. |
| `service_id` | ID | Obligatorio | Referencia a `calendar.txt` o `calendar_dates.txt`. |
| `trip_id` | ID | Obligatorio | Identificador único del viaje. |
| `trip_headsign` | Text | Opcional | Texto mostrado en el letrero del vehículo. |
| `trip_short_name` | Text | Opcional | Nombre corto público del viaje. |
| `direction_id` | Enum | Opcional | 0=Ida, 1=Vuelta. |
| `block_id` | ID | Opcional | ID para agrupar viajes en un bloque (mismo vehículo). |
| `shape_id` | ID | Opcional | Referencia a `shapes.txt` (geometría del viaje). |
| `wheelchair_accessible` | Enum | Opcional | 0=No info, 1=Accesible, 2=No accesible. |
| `bikes_allowed` | Enum | Opcional | 0=No info, 1=Permitido, 2=No permitido. |

### stop_times.txt
*Presencia: Obligatorio*
Horarios de paso por las paradas.

| Campo | Tipo | Presencia | Descripción |
| :--- | :--- | :--- | :--- |
| `trip_id` | ID | Obligatorio | Referencia a `trips.txt`. |
| `arrival_time` | Time | Condicional | Hora de llegada (HH:MM:SS). |
| `departure_time` | Time | Condicional | Hora de salida (HH:MM:SS). |
| `stop_id` | ID | Condicional | Referencia a `stops.txt`. |
| `stop_sequence` | Integer | Obligatorio | Orden de la parada en el viaje (creciente). |
| `stop_headsign` | Text | Opcional | Letrero específico para esta parada. |
| `pickup_type` | Enum | Opcional | 0=Regular, 1=No hay recogida, 2=Teléfono, 3=Coordinar con conductor. |
| `drop_off_type` | Enum | Opcional | Similar a `pickup_type` pero para bajadas. |
| `continuous_pickup` | Enum | Opcional | Recogida continua en este tramo. |
| `continuous_drop_off` | Enum | Opcional | Bajada continua en este tramo. |
| `shape_dist_traveled` | Float | Opcional | Distancia recorrida desde el inicio en unidades de `shapes.txt`. |
| `timepoint` | Enum | Opcional | 1=Exacto (hora mostrada en horarios), 0=Aproximado (interpolado). |

### calendar.txt
*Presencia: Condicionalmente Obligatorio*
Patrones de servicio semanales (ej. Lunes a Viernes).

| Campo | Tipo | Presencia | Descripción |
| :--- | :--- | :--- | :--- |
| `service_id` | ID | Obligatorio | ID del servicio. |
| `monday`...`sunday` | Enum | Obligatorio | 1=Opera, 0=No opera en este día de la semana. |
| `start_date` | Date | Obligatorio | Fecha de inicio del patrón (AAAAMMDD). |
| `end_date` | Date | Obligatorio | Fecha de fin del patrón. |

### calendar_dates.txt
*Presencia: Opcional*
Excepciones al servicio (festivos, cambios de día).

| Campo | Tipo | Presencia | Descripción |
| :--- | :--- | :--- | :--- |
| `service_id` | ID | Obligatorio | ID del servicio. |
| `date` | Date | Obligatorio | Fecha de la excepción. |
| `exception_type` | Enum | Obligatorio | 1=Servicio agregado, 2=Servicio eliminado. |

### frequencies.txt
*Presencia: Opcional*
Para servicios basados en frecuencia (ej. "pasa cada 10 min") en lugar de horarios fijos.

| Campo | Tipo | Presencia | Descripción |
| :--- | :--- | :--- | :--- |
| `trip_id` | ID | Obligatorio | Referencia al viaje plantilla. |
| `start_time` | Time | Obligatorio | Hora de inicio de la frecuencia. |
| `end_time` | Time | Obligatorio | Hora de fin de la frecuencia. |
| `headway_secs` | Integer | Obligatorio | Segundos entre vehículos. |
| `exact_times` | Enum | Opcional | 0=Frecuencia aprox., 1=Horarios exactos generados. |

### transfers.txt
*Presencia: Opcional*
Reglas de transbordo entre paradas.

| Campo | Tipo | Presencia | Descripción |
| :--- | :--- | :--- | :--- |
| `from_stop_id` | ID | Obligatorio | Parada de origen. |
| `to_stop_id` | ID | Obligatorio | Parada de destino. |
| `transfer_type` | Enum | Obligatorio | 0=Recomendado, 1=Esperar (sincronizado), 2=Tiempo mín., 3=No posible. |
| `min_transfer_time` | Integer | Opcional | Tiempo mínimo en segundos para el transbordo. |

### shapes.txt
*Presencia: Opcional*
Geometría (línea trazada) del recorrido en el mapa.

| Campo | Tipo | Presencia | Descripción |
| :--- | :--- | :--- | :--- |
| `shape_id` | ID | Obligatorio | Identificador de la forma. |
| `shape_pt_lat` | Latitude | Obligatorio | Latitud del punto. |
| `shape_pt_lon` | Longitude | Obligatorio | Longitud del punto. |
| `shape_pt_sequence` | Integer | Obligatorio | Orden del punto en la línea. |
| `shape_dist_traveled` | Float | Opcional | Distancia recorrida hasta este punto. |

---

## 3. Tarifas (Fares V1 - Legacy)

### fare_attributes.txt
*Presencia: Opcional*
Definición de atributos de tarifas (método antiguo).

| Campo | Tipo | Presencia | Descripción |
| :--- | :--- | :--- | :--- |
| `fare_id` | ID | Obligatorio | ID de la tarifa. |
| `price` | Float | Obligatorio | Precio. |
| `currency_type` | Currency | Obligatorio | Moneda (ISO 4217). |
| `payment_method` | Enum | Obligatorio | 0=A bordo, 1=Previo. |
| `transfers` | Enum | Obligatorio | Número de transbordos permitidos. |
| `agency_id` | ID | Condicional | Agencia asociada. |
| `transfer_duration` | Integer | Opcional | Duración de la transferencia en segundos. |

### fare_rules.txt
*Presencia: Opcional*
Reglas de aplicación para Fares V1.

| Campo | Tipo | Presencia | Descripción |
| :--- | :--- | :--- | :--- |
| `fare_id` | ID | Obligatorio | ID de la tarifa. |
| `route_id` | ID | Opcional | Aplica a esta ruta. |
| `origin_id` | ID | Opcional | Origen en zona X. |
| `destination_id` | ID | Opcional | Destino en zona Y. |
| `contains_id` | ID | Opcional | Pasa por zona Z. |

---

## 4. Tarifas Avanzadas (Fares V2)

### fare_media.txt
*Presencia: Opcional*
Medios físicos o virtuales para pagar (tarjeta, app, efectivo).

| Campo | Tipo | Presencia | Descripción |
| :--- | :--- | :--- | :--- |
| `fare_media_id` | ID | Obligatorio | ID del medio de pago. |
| `fare_media_name` | Text | Opcional | Nombre del medio. |
| `fare_media_type` | Enum | Obligatorio | 0=Ninguno, 1=Papel, 2=Tarjeta de tránsito, 3=cEMV (bancaria), 4=App móvil. |

### fare_products.txt
*Presencia: Opcional*
Productos tarifarios (billete sencillo, pase mensual).

| Campo | Tipo | Presencia | Descripción |
| :--- | :--- | :--- | :--- |
| `fare_product_id` | ID | Obligatorio | ID del producto. |
| `fare_product_name` | Text | Opcional | Nombre del producto. |
| `fare_media_id` | ID | Opcional | Medio necesario para usar este producto. |
| `amount` | Float | Obligatorio | Coste del producto. |
| `currency` | Currency | Obligatorio | Moneda. |

### rider_categories.txt
*Presencia: Opcional*
Categorías de pasajeros (Adulto, Estudiante, Senior).

| Campo | Tipo | Presencia | Descripción |
| :--- | :--- | :--- | :--- |
| `rider_category_id` | ID | Obligatorio | ID de la categoría. |
| `rider_category_name` | Text | Obligatorio | Nombre de la categoría. |
| `eligibility_url` | URL | Opcional | URL con reglas de elegibilidad. |

### fare_leg_rules.txt
*Presencia: Opcional*
Reglas de coste para un tramo de viaje.

| Campo | Tipo | Presencia | Descripción |
| :--- | :--- | :--- | :--- |
| `leg_group_id` | ID | Opcional | Grupo de tramos. |
| `network_id` | ID | Opcional | Red asociada. |
| `from_area_id` | ID | Opcional | Área de origen. |
| `to_area_id` | ID | Opcional | Área de destino. |
| `fare_product_id` | ID | Obligatorio | Producto tarifario que aplica. |
| `rider_category_id` | ID | Opcional | Categoría de pasajero requerida. |

### fare_leg_join_rules.txt
*Presencia: Opcional*
Reglas para unir tramos en un solo coste.

| Campo | Tipo | Presencia | Descripción |
| :--- | :--- | :--- | :--- |
| `from_leg_group_id` | ID | Obligatorio | Grupo de tramo anterior. |
| `to_leg_group_id` | ID | Obligatorio | Grupo de tramo siguiente. |
| `limit_seconds` | Integer | Opcional | Límite de tiempo para la unión. |

### fare_transfer_rules.txt
*Presencia: Opcional*
Reglas de transferencia de costes entre productos.

| Campo | Tipo | Presencia | Descripción |
| :--- | :--- | :--- | :--- |
| `from_leg_group_id` | ID | Opcional | Desde grupo de tramo. |
| `to_leg_group_id` | ID | Opcional | Hacia grupo de tramo. |
| `transfer_count` | Integer | Opcional | Número de transferencia (1ª, 2ª...). |
| `duration_limit` | Integer | Opcional | Límite de duración. |
| `fare_transfer_type` | Enum | Obligatorio | Tipo de coste de transferencia (0=A+B, 1=A+B-descuento, etc.). |
| `fare_product_id` | ID | Opcional | ID del producto resultante. |

### timeframes.txt
*Presencia: Opcional*
Periodos de tiempo para tarifas (pico/valle).

| Campo | Tipo | Presencia | Descripción |
| :--- | :--- | :--- | :--- |
| `timeframe_group_id` | ID | Obligatorio | ID del grupo de marco temporal. |
| `start_time` | Local Time | Opcional | Hora de inicio. |
| `end_time` | Local Time | Opcional | Hora de fin. |
| `service_id` | ID | Obligatorio | Días aplicables. |

---

## 5. Accesibilidad y Estaciones (Pathways)

### pathways.txt
*Presencia: Opcional*
Caminos internos dentro de estaciones (ej. pasillos, escaleras).

| Campo | Tipo | Presencia | Descripción |
| :--- | :--- | :--- | :--- |
| `pathway_id` | ID | Obligatorio | ID del camino. |
| `from_stop_id` | ID | Obligatorio | Nodo origen. |
| `to_stop_id` | ID | Obligatorio | Nodo destino. |
| `pathway_mode` | Enum | Obligatorio | 1=Pasillo, 2=Escaleras, 3=Cinta, 4=Escalera mec., 5=Ascensor, etc. |
| `is_bidirectional` | Enum | Obligatorio | 0=Unidireccional, 1=Bidireccional. |
| `length` | Float | Opcional | Longitud en metros. |
| `traversal_time` | Integer | Opcional | Tiempo en segundos para cruzar. |
| `stair_count` | Integer | Opcional | Número de escalones. |
| `max_slope` | Float | Opcional | Pendiente máxima. |
| `min_width` | Float | Opcional | Ancho mínimo. |
| `signposted_as` | Text | Opcional | Texto en la señalización. |

### levels.txt
*Presencia: Opcional*
Niveles o pisos de una estación.

| Campo | Tipo | Presencia | Descripción |
| :--- | :--- | :--- | :--- |
| `level_id` | ID | Obligatorio | ID del nivel. |
| `level_index` | Float | Obligatorio | Índice numérico (ej. 0 para PB, -1 para sótano). |
| `level_name` | Text | Opcional | Nombre del nivel (ej. "Entreplanta"). |

---

## 6. Redes y Áreas

### areas.txt
*Presencia: Opcional*
Define identificadores de áreas geográficas.

| Campo | Tipo | Presencia | Descripción |
| :--- | :--- | :--- | :--- |
| `area_id` | ID | Obligatorio | ID del área. |
| `area_name` | Text | Opcional | Nombre del área. |

### stop_areas.txt
*Presencia: Opcional*
Asigna paradas a áreas.

| Campo | Tipo | Presencia | Descripción |
| :--- | :--- | :--- | :--- |
| `area_id` | ID | Obligatorio | ID del área. |
| `stop_id` | ID | Obligatorio | ID de la parada. |

### networks.txt
*Presencia: Opcional*
Define redes de transporte.

| Campo | Tipo | Presencia | Descripción |
| :--- | :--- | :--- | :--- |
| `network_id` | ID | Obligatorio | ID de la red. |
| `network_name` | Text | Opcional | Nombre de la red. |

### route_networks.txt
*Presencia: Opcional*
Asigna rutas a redes.

| Campo | Tipo | Presencia | Descripción |
| :--- | :--- | :--- | :--- |
| `network_id` | ID | Obligatorio | ID de la red. |
| `route_id` | ID | Obligatorio | ID de la ruta. |

---

## 7. Servicios Flexibles (Flex/On-Demand)

### location_groups.txt
*Presencia: Opcional*
Grupos de ubicaciones para servicios flexibles.

| Campo | Tipo | Presencia | Descripción |
| :--- | :--- | :--- | :--- |
| `location_group_id` | ID | Obligatorio | ID del grupo. |
| `location_group_name` | Text | Opcional | Nombre del grupo. |

### location_group_stops.txt
*Presencia: Opcional*
Asigna paradas a grupos de ubicación.

| Campo | Tipo | Presencia | Descripción |
| :--- | :--- | :--- | :--- |
| `location_group_id` | ID | Obligatorio | ID del grupo. |
| `stop_id` | ID | Obligatorio | ID de la parada. |

### locations.geojson
*Presencia: Opcional*
Archivo GeoJSON (no CSV) que define polígonos para zonas de servicio flexible.
*Propiedades requeridas:* `id` (corresponde a location_id en stop_times).

### booking_rules.txt
*Presencia: Opcional*
Reglas de reserva para servicios bajo demanda.

| Campo | Tipo | Presencia | Descripción |
| :--- | :--- | :--- | :--- |
| `booking_rule_id` | ID | Obligatorio | ID de la regla. |
| `booking_type` | Enum | Obligatorio | 0=Tiempo real, 1=Mismo día, 2=Días previos. |
| `prior_notice_duration_min`| Integer | Opcional | Minutos mínimos de antelación. |
| `prior_notice_duration_max`| Integer | Opcional | Minutos máximos de antelación. |
| `prior_notice_last_day` | Integer | Opcional | Última hora del día anterior para reservar. |
| `prior_notice_last_time` | Time | Opcional | Hora límite del último día para reservar. |
| `prior_notice_start_day` | Integer | Opcional | Días antes que se abre la reserva. |
| `prior_notice_start_time` | Time | Opcional | Hora de inicio del primer día para reservar. |
| `booking_url` | URL | Opcional | URL para reservar. |
| `booking_info_phone` | Phone | Opcional | Teléfono para reservar. |

---