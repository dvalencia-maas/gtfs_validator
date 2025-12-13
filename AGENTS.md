# GTFS Validator

Este proyecto es para validar los archivos GTFS (General Transit Feed Specification).

## Referencia GTFS

Para referencia completa de la especificación GTFS, consultar: https://gtfs.org/es/documentation/schedule/reference/

## Convenciones del Documento

Las palabras clave "DEBE", "NO DEBE", "OBLIGATORIO", "DEBERÁ", "NO DEBERÁ", "DEBERÍA", "NO DEBERÍA", "RECOMENDADO", "PUEDE" y "OPCIONAL" en este documento deben interpretarse como se describe en RFC 2119.

## Definiciones de Términos

- **Conjunto de datos**: Un conjunto completo de archivos definidos por esta referencia de especificación.
- **Registro**: Una estructura de datos básica compuesta por varios valores de campo diferentes que describen una sola entidad.
- **Campo**: Una propiedad de un objeto o entidad.
- **Valor de campo**: Una entrada individual en un campo.
- **Día de servicio**: Un período de tiempo utilizado para indicar la programación de rutas. Puede exceder las 24:00:00 si el servicio comienza un día y finaliza el día siguiente.
- **Campo de texto a voz**: Campo destinado a ser leído como texto a voz (sin abreviaturas).
- **Tramo**: Viaje en el que un pasajero sube y baja entre un par de ubicaciones posteriores a lo largo de un viaje.
- **Viaje**: Viaje general desde el origen hasta el destino, incluidos todos los tramos y traslados intermedios.
- **Producto tarifario**: Productos tarifarios adquiribles que se pueden utilizar para pagar o validar el viaje.

## Condiciones de Presencia

- **Obligatorio**: El campo o archivo debe estar incluido en el conjunto de datos y contener un valor válido para cada registro.
- **Opcional**: El campo o archivo puede omitirse del conjunto de datos.
- **Condicionalmente Obligatorio**: El campo o archivo debe incluirse bajo las condiciones descritas.
- **Condicionalmente Prohibido**: El campo o archivo no debe incluirse bajo las condiciones descritas.
- **Recomendado**: El campo o archivo puede omitirse, pero es una buena práctica incluirlo.

## Tipos de Campo

- **Color**: Un color codificado como un número hexadecimal de seis dígitos (ej: FFFFFF para blanco, 000000 para negro).
- **Código de moneda**: Un código de moneda alfabético ISO 4217 (ej: CAD, EUR, JPY).
- **Cantidad de moneda**: Un valor decimal que indica una cantidad de moneda según ISO 4217.
- **Date**: Día de servicio en formato AAAAMMDD (ej: 20180913).
- **Email**: Una dirección de correo electrónico (ej: example@example.com).
- **Enum**: Una opción de un conjunto de constantes predefinidas.
- **ID**: Un ID interno que no debe mostrarse a jinetes, secuencia de caracteres UTF-8.
- **Código de idioma**: Un código de idioma IETF BCP 47 (ej: en, en-US, de).
- **Latitud**: Latitud WGS84 en grados decimales (-90.0 a 90.0).
- **Longitud**: Longitud WGS84 en grados decimales (-180.0 a 180.0).
- **Float**: Un número de punto flotante.
- **Integer**: Un número entero.
- **Número de teléfono**: Un número de teléfono.
- **Time**: Hora en formato HH:MM:SS (también se acepta H:MM:SS). El tiempo se mide a partir del "mediodía menos 12 h" del día de servicio (efectivamente, medianoche). Para los horarios que ocurren después de la medianoche del día del servicio, ingrese la hora como un valor mayor que 24:00:00. Ejemplo: 14:30:00 para las 2:30 p.m. o 25:35:00 para las 1:35 a.m. del día siguiente.
- **Local Time**: Hora en formato HH:MM:SS (también se acepta H:MM:SS). Representa la hora local del lugar especificado. No puede superar 24:00:00.
- **Text**: Una string de caracteres UTF-8, destinado a ser mostrado y legible por humanos.
- **Zona horaria**: Zona horaria TZ de https://www.iana.org/time-zones (ej: Asia/Tokyo, America/Los_Angeles).
- **URL**: Una URL completa que incluye http:// o https://.

## Signos de Campo

- **No negativo**: Mayor o igual a 0.
- **Diferente de cero**: No es igual a 0.
- **Positivo**: Mayor que 0.

## Requisitos de Archivo

- Todos los archivos deben guardarse como texto delimitado por comas.
- La primera línea de cada archivo debe contener nombres de campos.
- Todos los nombres de archivos y campos distinguen entre mayúsculas y minúsculas.
- Los valores de los campos no deben contener tabulaciones, retornos de carro ni líneas nuevas.
- Los valores de campo que contienen comillas o comas deben estar entre comillas dobles.
- Los valores de campo no deben contener etiquetas HTML, comentarios ni secuencias de escape.
- Deben eliminarse los espacios adicionales entre campos o nombres de campos.
- Cada línea debe terminar con un carácter de salto de línea CRLF o LF.
- Los archivos deben codificarse en UTF-8.
- Todos los archivos del conjunto de datos deben estar comprimidos juntos en un archivo zip.
- Todas las cadenas de texto orientadas al cliente deben usar mayúsculas y minúsculas.
- Se debe evitar el uso de abreviaturas en todo el feed.

## Publicación de Conjuntos de Datos

- Los conjuntos de datos deben publicarse en una URL pública y permanente.
- Los datos GTFS deben publicarse en iteraciones.
- Los conjuntos de datos deben mantener identificadores persistentes para stop_id, route_id y agency_id.
- Un conjunto de datos GTFS debe contener el servicio actual y el próximo.
- El conjunto de datos GTFS publicado debe ser válido durante al menos los próximos 7 días.
- Si es posible, el conjunto de datos GTFS debe cubrir al menos los próximos 30 días de servicio.
- Los servicios antiguos deben eliminarse del feed.
- Si una modificación del servicio entrará en vigencia en 7 días o menos, debe expresarse a través de un feed GTFS en tiempo real.
- El servidor web debe configurarse para informar correctamente la fecha de modificación del archivo.

---

## Archivos de Conjunto de Datos

Esta especificación define los siguientes archivos:

### Archivos Obligatorios

- **agency.txt**: Agencias de tránsito con servicio representado en este conjunto de datos.
  - **Clave primaria**: `agency_id`
  - **Campos principales**: `agency_id` (ID), `agency_name` (Text), `agency_url` (URL), `agency_timezone` (Timezone)
  - **Campos opcionales**: `agency_lang` (Language Code), `agency_phone` (Phone), `agency_fare_url` (URL), `agency_email` (Email)

- **routes.txt**: Rutas de tránsito. Una ruta es un grupo de viajes que se muestran a los pasajeros como un único servicio.
  - **Clave primaria**: `route_id`
  - **Campos principales**: `route_id` (ID), `agency_id` (ID), `route_short_name` (Text), `route_long_name` (Text), `route_type` (Enum)
  - **Campos opcionales**: `route_desc` (Text), `route_url` (URL), `route_color` (Color), `route_text_color` (Color), `route_sort_order` (Integer, non-negative)

- **trips.txt**: Viajes para cada ruta. Un viaje es una secuencia de dos o más paradas que ocurren durante un período de tiempo específico.
  - **Clave primaria**: `trip_id`
  - **Campos principales**: `route_id` (ID), `service_id` (ID), `trip_id` (ID)
  - **Campos opcionales**: `trip_headsign` (Text), `trip_short_name` (Text), `direction_id` (Enum), `block_id` (ID), `shape_id` (ID), `wheelchair_accessible` (Enum), `bikes_allowed` (Enum)

- **stop_times.txt**: Horas de llegada y salida de un vehículo a las paradas para cada viaje.
  - **Clave primaria**: `trip_id`, `stop_sequence`
  - **Campos principales**: `trip_id` (ID), `stop_sequence` (Integer, non-negative)
  - **Campos opcionales**: `arrival_time` (Time), `departure_time` (Time), `stop_id` (ID), `stop_headsign` (Text), `pickup_type` (Enum), `drop_off_type` (Enum), `shape_dist_traveled` (Float, non-negative), `timepoint` (Enum)

### Archivos Condicionalmente Obligatorios

- **stops.txt**: Paradas donde los vehículos recogen o dejan a los pasajeros. También define estaciones y entradas de estaciones.
  - **Clave primaria**: `stop_id`
  - **Campos principales**: `stop_id` (ID)
  - **Campos opcionales**: `stop_code` (Text), `stop_name` (Text), `tts_stop_name` (Text), `stop_desc` (Text), `stop_lat` (Latitude), `stop_lon` (Longitude), `zone_id` (ID), `stop_url` (URL), `location_type` (Enum), `parent_station` (ID), `stop_timezone` (Timezone), `wheelchair_boarding` (Enum), `level_id` (ID), `platform_code` (Text)

- **calendar.txt**: Fechas de servicio especificadas mediante un cronograma semanal con fechas de inicio y finalización.
  - **Clave primaria**: `service_id`
  - **Campos principales**: `service_id` (ID), `monday` (Enum), `tuesday` (Enum), `wednesday` (Enum), `thursday` (Enum), `friday` (Enum), `saturday` (Enum), `sunday` (Enum), `start_date` (Date), `end_date` (Date)

- **calendar_dates.txt**: Excepciones para los servicios definidos en calendar.txt.
  - **Clave primaria**: `service_id`, `date`
  - **Campos principales**: `service_id` (ID), `date` (Date), `exception_type` (Enum)

- **levels.txt**: Niveles dentro de las estaciones.
  - **Clave primaria**: `level_id`
  - **Campos principales**: `level_id` (ID), `level_index` (Float, non-negative)
  - **Campos opcionales**: `level_name` (Text)

- **feed_info.txt**: Metadatos del conjunto de datos, incluida la información del editor, la versión y la caducidad.
  - **Campos principales**: `feed_publisher_name` (Text), `feed_publisher_url` (URL), `feed_lang` (Language Code)
  - **Campos opcionales**: `default_lang` (Language Code), `feed_start_date` (Date), `feed_end_date` (Date), `feed_version` (Text), `feed_contact_email` (Email), `feed_contact_url` (URL)

### Archivos Condicionalmente Prohibidos

- **networks.txt**: Agrupación de redes de rutas.
  - **Clave primaria**: `network_id`
  - **Campos principales**: `network_id` (ID)
  - **Campos opcionales**: `network_name` (Text)

- **route_networks.txt**: Reglas para asignar rutas a redes.
  - **Campos principales**: `network_id` (ID), `route_id` (ID)

### Archivos de Tarifas (Opcionales)

- **fare_attributes.txt**: Información de tarifas para las rutas de una agencia de tránsito.
  - **Clave primaria**: `fare_id`
  - **Campos principales**: `fare_id` (ID), `price` (Currency), `currency_type` (Currency Code), `payment_method` (Enum), `transfers` (Enum)
  - **Campos opcionales**: `agency_id` (ID), `transfer_duration` (Integer, non-negative)

- **fare_rules.txt**: Reglas para aplicar tarifas por itinerarios.
  - **Campos principales**: `fare_id` (ID)
  - **Campos opcionales**: `route_id` (ID), `origin_id` (ID), `destination_id` (ID), `contains_id` (ID)

### Archivos de Ubicación y Rutas (Opcionales)

- **shapes.txt**: Reglas para mapear rutas de tránsito de vehículos, a veces denominadas alineaciones de rutas.
  - **Clave primaria**: `shape_id`, `shape_pt_sequence`
  - **Campos principales**: `shape_id` (ID), `shape_pt_lat` (Latitude), `shape_pt_lon` (Longitude), `shape_pt_sequence` (Integer, non-negative)
  - **Campos opcionales**: `shape_dist_traveled` (Float, non-negative)

- **areas.txt**: Agrupación zonal de localizaciones.
  - **Clave primaria**: `area_id`
  - **Campos principales**: `area_id` (ID)
  - **Campos opcionales**: `area_name` (Text)

- **stop_areas.txt**: Reglas para asignar paradas a áreas.
  - **Campos principales**: `area_id` (ID), `stop_id` (ID)

- **location_groups.txt**: Un grupo de paradas que en conjunto indican lugares donde un pasajero puede solicitar que lo recojen o lo dejen.
  - **Clave primaria**: `location_group_id`
  - **Campos principales**: `location_group_id` (ID)
  - **Campos opcionales**: `location_group_name` (Text)

- **location_group_stops.txt**: Reglas para asignar paradas a grupos de ubicación.
  - **Campos principales**: `location_group_id` (ID), `stop_id` (ID)

- **locations.geojson**: Zonas para solicitudes de recogida o devolución de pasajeros mediante servicios bajo demanda, representadas como polígonos GeoJSON.
  - **Formato**: FeatureCollection GeoJSON
  - **Campos obligatorios**: `type` (String), `features` (Array), cada Feature debe tener `id` (String), `properties` (Object), `geometry` (Object)
  - **Campos opcionales**: `stop_name` (Text), `stop_desc` (Text)

### Archivos de Servicios y Transferencias (Opcionales)

- **frequencies.txt**: Intervalo (tiempo entre viajes) para el servicio basado en el intervalo o una representación comprimida del servicio de horario fijo.
  - **Clave primaria**: `trip_id`, `start_time`
  - **Campos principales**: `trip_id` (ID), `start_time` (Time), `end_time` (Time), `headway_secs` (Integer, non-negative)
  - **Campos opcionales**: `exact_times` (Enum)

- **transfers.txt**: Reglas para realizar conexiones en puntos de transferencia entre rutas.
  - **Campos principales**: `transfer_type` (Enum)
  - **Campos opcionales**: `from_stop_id` (ID), `to_stop_id` (ID), `from_route_id` (ID), `to_route_id` (ID), `from_trip_id` (ID), `to_trip_id` (ID), `min_transfer_time` (Integer, non-negative)

- **pathways.txt**: Recorridos que unen ubicaciones dentro de las estaciones.
  - **Clave primaria**: `pathway_id`
  - **Campos principales**: `pathway_id` (ID), `from_stop_id` (ID), `to_stop_id` (ID), `pathway_mode` (Enum), `is_bidirectional` (Enum)
  - **Campos opcionales**: `length` (Float, non-negative), `traversal_time` (Integer, non-negative), `stair_count` (Integer, non-zero), `max_slope` (Float), `min_width` (Float, positive), `signposted_as` (Text), `reversed_signposted_as` (Text)

- **booking_rules.txt**: Información de reserva para servicios solicitados por pasajeros.
  - **Clave primaria**: `booking_rule_id`
  - **Campos principales**: `booking_rule_id` (ID), `booking_type` (Enum)
  - **Campos opcionales**: `prior_notice_duration_min` (Integer), `prior_notice_duration_max` (Integer), `prior_notice_last_day` (Integer), `prior_notice_last_time` (Time), `prior_notice_start_day` (Integer), `prior_notice_start_time` (Time), `prior_notice_service_id` (ID), `message` (Text), `pickup_message` (Text), `drop_off_message` (Text), `phone_number` (Phone), `info_url` (URL), `booking_url` (URL)

### Archivos de Metadatos (Opcionales)

- **translations.txt**: Traducciones de valores de conjuntos de datos de cara al cliente.
  - **Clave primaria**: `table_name`, `field_name`, `language`, `record_id`, `record_sub_id`, `field_value`
  - **Campos principales**: `table_name` (Enum), `field_name` (Text), `language` (Language Code), `translation` (Text/URL/Email/Phone)
  - **Campos opcionales**: `record_id` (ID), `record_sub_id` (ID), `field_value` (Text)

- **attributions.txt**: Atribuciones de conjuntos de datos.
  - **Clave primaria**: `attribution_id`
  - **Campos principales**: `organization_name` (Text)
  - **Campos opcionales**: `attribution_id` (ID), `agency_id` (ID), `route_id` (ID), `trip_id` (ID), `is_producer` (Enum), `is_operator` (Enum), `is_authority` (Enum), `attribution_url` (URL), `attribution_email` (Email), `attribution_phone` (Phone)

---

## Testing Commands

### Prerequisites
- Node.js installed

### Running Tests
```bash
npm test
```

### Linting
```bash
npm run lint
```

### Type checking
```bash
npm run typecheck
```

## Development Commands

### Running the application
```bash
node index.js
```