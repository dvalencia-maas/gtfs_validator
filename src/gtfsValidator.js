const fs = require('fs-extra');
const csv = require('csv-parser');
const path = require('path');

class GTFSValidator {
    constructor() {
        this.requiredFiles = [
            'agency.txt',
            'routes.txt',
            'trips.txt',
            'stop_times.txt'
        ];

        this.conditionalRequiredFiles = [
            'stops.txt',
            'calendar.txt',
            'calendar_dates.txt',
            'levels.txt',
            'feed_info.txt'
        ];

        this.optionalFiles = [
            'fare_attributes.txt',
            'fare_rules.txt',
            'timeframes.txt',
            'rider_categories.txt',
            'fare_media.txt',
            'fare_products.txt',
            'fare_leg_rules.txt',
            'fare_leg_join_rules.txt',
            'fare_transfer_rules.txt',
            'areas.txt',
            'stop_areas.txt',
            'networks.txt',
            'route_networks.txt',
            'shapes.txt',
            'frequencies.txt',
            'transfers.txt',
            'pathways.txt',
            'location_groups.txt',
            'location_group_stops.txt',
            'locations.geojson',
            'booking_rules.txt',
            'translations.txt',
            'attributions.txt'
        ];

        this.fileSchemas = {
            'agency.txt': {
                required: ['agency_name', 'agency_url', 'agency_timezone'],
                optional: ['agency_id', 'agency_lang', 'agency_phone', 'agency_fare_url', 'agency_email', 'cemv_support'],
                types: {
                    agency_id: 'ID',
                    agency_name: 'Text',
                    agency_url: 'URL',
                    agency_timezone: 'Timezone',
                    agency_lang: 'Language Code',
                    agency_phone: 'Phone',
                    agency_fare_url: 'URL',
                    agency_email: 'Email',
                    cemv_support: 'Enum'
                }
            },
            'stops.txt': {
                required: ['stop_id'],
                optional: ['stop_code', 'stop_name', 'tts_stop_name', 'stop_desc', 'stop_lat', 'stop_lon', 'zone_id', 'stop_url', 'location_type', 'parent_station', 'stop_timezone', 'wheelchair_boarding', 'level_id', 'platform_code', 'stop_access'],
                types: {
                    stop_id: 'ID',
                    stop_code: 'Text',
                    stop_name: 'Text',
                    tts_stop_name: 'Text',
                    stop_desc: 'Text',
                    stop_lat: 'Latitude',
                    stop_lon: 'Longitude',
                    zone_id: 'ID',
                    stop_url: 'URL',
                    location_type: 'Enum',
                    parent_station: 'ID',
                    stop_timezone: 'Timezone',
                    wheelchair_boarding: 'Enum',
                    level_id: 'ID',
                    platform_code: 'Text',
                    stop_access: 'Enum'
                }
            },
            'routes.txt': {
                required: ['route_id', 'route_type'],
                optional: ['agency_id', 'route_short_name', 'route_long_name', 'route_desc', 'route_url', 'route_color', 'route_text_color', 'route_sort_order', 'continuous_pickup', 'continuous_drop_off', 'network_id', 'cemv_support'],
                types: {
                    route_id: 'ID',
                    agency_id: 'ID',
                    route_short_name: 'Text',
                    route_long_name: 'Text',
                    route_desc: 'Text',
                    route_type: 'Enum',
                    route_url: 'URL',
                    route_color: 'Color',
                    route_text_color: 'Color',
                    route_sort_order: 'Integer, non-negative',
                    continuous_pickup: 'Enum',
                    continuous_drop_off: 'Enum',
                    network_id: 'ID',
                    cemv_support: 'Enum'
                }
            },
            'trips.txt': {
                required: ['route_id', 'service_id', 'trip_id'],
                optional: ['trip_headsign', 'trip_short_name', 'direction_id', 'block_id', 'shape_id', 'wheelchair_accessible', 'bikes_allowed', 'cars_allowed'],
                types: {
                    route_id: 'ID',
                    service_id: 'ID',
                    trip_id: 'ID',
                    trip_headsign: 'Text',
                    trip_short_name: 'Text',
                    direction_id: 'Enum',
                    block_id: 'ID',
                    shape_id: 'ID',
                    wheelchair_accessible: 'Enum',
                    bikes_allowed: 'Enum',
                    cars_allowed: 'Enum'
                }
            },
            'stop_times.txt': {
                required: ['trip_id', 'stop_sequence'],
                optional: ['arrival_time', 'departure_time', 'stop_id', 'location_group_id', 'location_id', 'stop_headsign', 'start_pickup_drop_off_window', 'end_pickup_drop_off_window', 'pickup_type', 'drop_off_type', 'continuous_pickup', 'continuous_drop_off', 'shape_dist_traveled', 'timepoint', 'pickup_booking_rule_id', 'drop_off_booking_rule_id'],
                types: {
                    trip_id: 'ID',
                    arrival_time: 'Time',
                    departure_time: 'Time',
                    stop_id: 'ID',
                    stop_sequence: 'Integer, non-negative',
                    location_group_id: 'ID',
                    location_id: 'ID',
                    stop_headsign: 'Text',
                    start_pickup_drop_off_window: 'Time',
                    end_pickup_drop_off_window: 'Time',
                    pickup_type: 'Enum',
                    drop_off_type: 'Enum',
                    continuous_pickup: 'Enum',
                    continuous_drop_off: 'Enum',
                    shape_dist_traveled: 'Float, non-negative',
                    timepoint: 'Enum',
                    pickup_booking_rule_id: 'ID',
                    drop_off_booking_rule_id: 'ID'
                }
            },
            'calendar.txt': {
                required: ['service_id', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday', 'start_date', 'end_date'],
                optional: [],
                types: {
                    service_id: 'ID',
                    monday: 'Enum',
                    tuesday: 'Enum',
                    wednesday: 'Enum',
                    thursday: 'Enum',
                    friday: 'Enum',
                    saturday: 'Enum',
                    sunday: 'Enum',
                    start_date: 'Date',
                    end_date: 'Date'
                }
            },
            'calendar_dates.txt': {
                required: ['service_id', 'date', 'exception_type'],
                optional: [],
                types: {
                    service_id: 'ID',
                    date: 'Date',
                    exception_type: 'Enum'
                }
            },
            'fare_attributes.txt': {
                required: ['fare_id', 'price', 'currency_type', 'payment_method', 'transfers'],
                optional: ['agency_id', 'transfer_duration'],
                types: {
                    fare_id: 'ID',
                    price: 'Currency',
                    currency_type: 'Currency Code',
                    payment_method: 'Enum',
                    transfers: 'Enum',
                    agency_id: 'ID',
                    transfer_duration: 'Integer, non-negative'
                }
            },
            'fare_rules.txt': {
                required: ['fare_id'],
                optional: ['route_id', 'origin_id', 'destination_id', 'contains_id'],
                types: {
                    fare_id: 'ID',
                    route_id: 'ID',
                    origin_id: 'ID',
                    destination_id: 'ID',
                    contains_id: 'ID'
                }
            },
            'timeframes.txt': {
                required: ['timeframe_group_id', 'service_id'],
                optional: ['start_time', 'end_time'],
                types: {
                    timeframe_group_id: 'ID',
                    service_id: 'ID',
                    start_time: 'Local Time',
                    end_time: 'Local Time'
                }
            },
            'rider_categories.txt': {
                required: ['rider_category_id', 'rider_category_name', 'is_default_fare_category'],
                optional: ['eligibility_url'],
                types: {
                    rider_category_id: 'ID',
                    rider_category_name: 'Text',
                    is_default_fare_category: 'Enum',
                    eligibility_url: 'URL'
                }
            },
            'fare_media.txt': {
                required: ['fare_media_id', 'fare_media_type'],
                optional: ['fare_media_name'],
                types: {
                    fare_media_id: 'ID',
                    fare_media_type: 'Enum',
                    fare_media_name: 'Text'
                }
            },
            'fare_products.txt': {
                required: ['fare_product_id', 'amount', 'currency'],
                optional: ['fare_product_name', 'rider_category_id', 'fare_media_id'],
                types: {
                    fare_product_id: 'ID',
                    amount: 'Currency',
                    currency: 'Currency Code',
                    fare_product_name: 'Text',
                    rider_category_id: 'ID',
                    fare_media_id: 'ID'
                }
            },
            'fare_leg_rules.txt': {
                required: ['fare_product_id'],
                optional: ['leg_group_id', 'network_id', 'from_area_id', 'to_area_id', 'from_timeframe_group_id', 'to_timeframe_group_id', 'rule_priority'],
                types: {
                    leg_group_id: 'ID',
                    network_id: 'ID',
                    from_area_id: 'ID',
                    to_area_id: 'ID',
                    from_timeframe_group_id: 'ID',
                    to_timeframe_group_id: 'ID',
                    fare_product_id: 'ID',
                    rule_priority: 'Integer, non-negative'
                }
            },
            'fare_leg_join_rules.txt': {
                required: ['from_network_id', 'to_network_id'],
                optional: ['from_stop_id', 'to_stop_id'],
                types: {
                    from_network_id: 'ID',
                    to_network_id: 'ID',
                    from_stop_id: 'ID',
                    to_stop_id: 'ID'
                }
            },
            'fare_transfer_rules.txt': {
                required: ['fare_transfer_type'],
                optional: ['from_leg_group_id', 'to_leg_group_id', 'fare_product_id', 'transfer_count', 'duration_limit', 'duration_limit_type'],
                types: {
                    from_leg_group_id: 'ID',
                    to_leg_group_id: 'ID',
                    fare_product_id: 'ID',
                    transfer_count: 'Integer, non-negative',
                    duration_limit: 'Integer, non-negative',
                    duration_limit_type: 'Enum',
                    fare_transfer_type: 'Enum'
                }
            },
            'areas.txt': {
                required: ['area_id'],
                optional: ['area_name'],
                types: {
                    area_id: 'ID',
                    area_name: 'Text'
                }
            },
            'stop_areas.txt': {
                required: ['area_id', 'stop_id'],
                optional: [],
                types: {
                    area_id: 'ID',
                    stop_id: 'ID'
                }
            },
            'networks.txt': {
                required: ['network_id'],
                optional: ['network_name'],
                types: {
                    network_id: 'ID',
                    network_name: 'Text'
                }
            },
            'route_networks.txt': {
                required: ['network_id', 'route_id'],
                optional: [],
                types: {
                    network_id: 'ID',
                    route_id: 'ID'
                }
            },
            'shapes.txt': {
                required: ['shape_id', 'shape_pt_lat', 'shape_pt_lon', 'shape_pt_sequence'],
                optional: ['shape_dist_traveled'],
                types: {
                    shape_id: 'ID',
                    shape_pt_lat: 'Latitude',
                    shape_pt_lon: 'Longitude',
                    shape_pt_sequence: 'Integer, non-negative',
                    shape_dist_traveled: 'Float, non-negative'
                }
            },
            'frequencies.txt': {
                required: ['trip_id', 'start_time', 'end_time', 'headway_secs'],
                optional: ['exact_times'],
                types: {
                    trip_id: 'ID',
                    start_time: 'Time',
                    end_time: 'Time',
                    headway_secs: 'Integer, non-negative',
                    exact_times: 'Enum'
                }
            },
            'transfers.txt': {
                required: ['transfer_type'],
                optional: ['from_stop_id', 'to_stop_id', 'from_route_id', 'to_route_id', 'from_trip_id', 'to_trip_id', 'min_transfer_time'],
                types: {
                    from_stop_id: 'ID',
                    to_stop_id: 'ID',
                    from_route_id: 'ID',
                    to_route_id: 'ID',
                    from_trip_id: 'ID',
                    to_trip_id: 'ID',
                    transfer_type: 'Enum',
                    min_transfer_time: 'Integer, non-negative'
                }
            },
            'pathways.txt': {
                required: ['pathway_id', 'from_stop_id', 'to_stop_id', 'pathway_mode', 'is_bidirectional'],
                optional: ['length', 'traversal_time', 'stair_count', 'max_slope', 'min_width', 'signposted_as', 'reversed_signposted_as'],
                types: {
                    pathway_id: 'ID',
                    from_stop_id: 'ID',
                    to_stop_id: 'ID',
                    pathway_mode: 'Enum',
                    is_bidirectional: 'Enum',
                    length: 'Float, non-negative',
                    traversal_time: 'Integer, non-negative',
                    stair_count: 'Integer, non-zero',
                    max_slope: 'Float',
                    min_width: 'Float, positive',
                    signposted_as: 'Text',
                    reversed_signposted_as: 'Text'
                }
            },
            'levels.txt': {
                required: ['level_id', 'level_index'],
                optional: ['level_name'],
                types: {
                    level_id: 'ID',
                    level_index: 'Float, non-negative',
                    level_name: 'Text'
                }
            },
            'location_groups.txt': {
                required: ['location_group_id'],
                optional: ['location_group_name'],
                types: {
                    location_group_id: 'ID',
                    location_group_name: 'Text'
                }
            },
            'location_group_stops.txt': {
                required: ['location_group_id', 'stop_id'],
                optional: [],
                types: {
                    location_group_id: 'ID',
                    stop_id: 'ID'
                }
            },
            'booking_rules.txt': {
                required: ['booking_rule_id', 'booking_type'],
                optional: ['prior_notice_duration_min', 'prior_notice_duration_max', 'prior_notice_last_day', 'prior_notice_last_time', 'prior_notice_start_day', 'prior_notice_start_time', 'prior_notice_service_id', 'message', 'pickup_message', 'drop_off_message', 'phone_number', 'info_url', 'booking_url'],
                types: {
                    booking_rule_id: 'ID',
                    booking_type: 'Enum',
                    prior_notice_duration_min: 'Integer',
                    prior_notice_duration_max: 'Integer',
                    prior_notice_last_day: 'Integer',
                    prior_notice_last_time: 'Time',
                    prior_notice_start_day: 'Integer',
                    prior_notice_start_time: 'Time',
                    prior_notice_service_id: 'ID',
                    message: 'Text',
                    pickup_message: 'Text',
                    drop_off_message: 'Text',
                    phone_number: 'Phone',
                    info_url: 'URL',
                    booking_url: 'URL'
                }
            },
            'feed_info.txt': {
                required: ['feed_publisher_name', 'feed_publisher_url', 'feed_lang'],
                optional: ['default_lang', 'feed_start_date', 'feed_end_date', 'feed_version', 'feed_contact_email', 'feed_contact_url'],
                types: {
                    feed_publisher_name: 'Text',
                    feed_publisher_url: 'URL',
                    feed_lang: 'Language Code',
                    default_lang: 'Language Code',
                    feed_start_date: 'Date',
                    feed_end_date: 'Date',
                    feed_version: 'Text',
                    feed_contact_email: 'Email',
                    feed_contact_url: 'URL'
                }
            },
            'translations.txt': {
                required: ['table_name', 'field_name', 'language', 'translation'],
                optional: ['record_id', 'record_sub_id', 'field_value'],
                types: {
                    table_name: 'Enum',
                    field_name: 'Text',
                    language: 'Language Code',
                    translation: 'Text',
                    record_id: 'ID',
                    record_sub_id: 'ID',
                    field_value: 'Text'
                }
            },
            'attributions.txt': {
                required: ['organization_name'],
                optional: ['attribution_id', 'agency_id', 'route_id', 'trip_id', 'is_producer', 'is_operator', 'is_authority', 'attribution_url', 'attribution_email', 'attribution_phone'],
                types: {
                    attribution_id: 'ID',
                    agency_id: 'ID',
                    route_id: 'ID',
                    trip_id: 'ID',
                    organization_name: 'Text',
                    is_producer: 'Enum',
                    is_operator: 'Enum',
                    is_authority: 'Enum',
                    attribution_url: 'URL',
                    attribution_email: 'Email',
                    attribution_phone: 'Phone'
                }
            }
        };

        // Validadores específicos para cada tipo de dato
        this.typeValidators = {
            'ID': (value) => value && typeof value === 'string' && value.trim() !== '',
            'Text': (value) => value && typeof value === 'string',
            'URL': (value) => {
                if (!value || typeof value !== 'string') return false;
                try {
                    const url = new URL(value);
                    return url.protocol === 'http:' || url.protocol === 'https:';
                } catch {
                    return false;
                }
            },
            'Email': (value) => {
                if (!value || typeof value !== 'string') return false;
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(value);
            },
            'Phone': (value) => value && typeof value === 'string' && value.trim() !== '',
            'Color': (value) => {
                if (!value || typeof value !== 'string') return false;
                const colorRegex = /^[0-9A-Fa-f]{6}$/;
                return colorRegex.test(value);
            },
            'Currency Code': (value) => {
                if (!value || typeof value !== 'string') return false;
                const currencyRegex = /^[A-Z]{3}$/;
                return currencyRegex.test(value);
            },
            'Currency': (value) => !isNaN(parseFloat(value)) && parseFloat(value) >= 0,
            'Date': (value) => {
                if (!value || typeof value !== 'string') return false;
                const dateRegex = /^\d{8}$/;
                if (!dateRegex.test(value)) return false;
                const year = parseInt(value.substring(0, 4));
                const month = parseInt(value.substring(4, 6));
                const day = parseInt(value.substring(6, 8));
                if (year < 1900 || year > 2100) return false;
                if (month < 1 || month > 12) return false;
                if (day < 1 || day > 31) return false;
                return true;
            },
            'Time': (value) => {
                if (!value || typeof value !== 'string') return false;
                // Permite H:MM:SS o HH:MM:SS con horas > 24:00:00 para horarios después de medianoche
                const timeRegex = /^([0-9]|[0-9]{2}):[0-5][0-9]:[0-5][0-9]$/;
                if (!timeRegex.test(value)) return false;
                const [hours, minutes, seconds] = value.split(':').map(Number);
                return minutes >= 0 && minutes <= 59 && seconds >= 0 && seconds <= 59;
            },
            'Local Time': (value) => {
                if (!value || typeof value !== 'string') return false;
                // Hora local estándar en formato HH:MM:SS o H:MM:SS (0-23:59:59)
                const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;
                if (!timeRegex.test(value)) return false;
                const [hours, minutes, seconds] = value.split(':').map(Number);
                return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59 && seconds >= 0 && seconds <= 59;
            },
            'Language Code': (value) => {
                if (!value || typeof value !== 'string') return false;
                const langRegex = /^[a-z]{2}(-[A-Z]{2})?$/;
                return langRegex.test(value);
            },
            'Timezone': (value) => {
                if (!value || typeof value !== 'string') return false;
                // Validación básica de zonas horarias comunes
                const validTimezones = ['America/New_York', 'Europe/London', 'Asia/Tokyo', 'America/Los_Angeles', 'America/Chicago'];
                return validTimezones.includes(value) || value.includes('/');
            },
            'Latitude': (value) => {
                const lat = parseFloat(value);
                return !isNaN(lat) && lat >= -90 && lat <= 90;
            },
            'Longitude': (value) => {
                const lon = parseFloat(value);
                return !isNaN(lon) && lon >= -180 && lon <= 180;
            },
            'Integer': (value) => !isNaN(parseInt(value)),
            'Float': (value) => !isNaN(parseFloat(value)),
            'Integer, non-negative': (value) => {
                const num = parseInt(value);
                return !isNaN(num) && num >= 0;
            },
            'Float, non-negative': (value) => {
                const num = parseFloat(value);
                return !isNaN(num) && num >= 0;
            },
            'Integer, non-zero': (value) => {
                const num = parseInt(value);
                return !isNaN(num) && num !== 0;
            },
            'Float, positive': (value) => {
                const num = parseFloat(value);
                return !isNaN(num) && num > 0;
            },
            'Enum': (value, field, fileName) => {
                if (!value || typeof value !== 'string') return false;
                return this.validateEnumValue(field, fileName, value);
            }
        };
    }

  validateEnumValue(field, fileName, value) {
        const enumValues = {
            'route_type': ['0', '1', '2', '3', '4', '5', '6', '7', '11', '12'],
            'direction_id': ['0', '1'],
            'wheelchair_accessible': ['0', '1', '2'],
            'bikes_allowed': ['0', '1', '2'],
            'cars_allowed': ['0', '1', '2'],
            'pickup_type': ['0', '1', '2', '3'],
            'drop_off_type': ['0', '1', '2', '3'],
            'timepoint': ['0', '1'],
            'continuous_pickup': ['0', '1', '2', '3'],
            'continuous_drop_off': ['0', '1', '2', '3'],
            'payment_method': ['0', '1'],
            'transfers': ['0', '1', '2', ''],
            'pathway_mode': ['1', '2', '3', '4', '5', '6', '7'],
            'is_bidirectional': ['0', '1'],
            'location_type': ['0', '1', '2', '3', '4'],
            'wheelchair_boarding': ['0', '1', '2'],
            'is_producer': ['0', '1'],
            'is_operator': ['0', '1'],
            'is_authority': ['0', '1'],
            'exact_times': ['0', '1'],
            'transfer_type': ['0', '1', '2', '3', '4', '5'],
            'booking_type': ['0', '1', '2'],
            'is_default_fare_category': ['0', '1'],
            'fare_media_type': ['0', '1', '2', '3', '4'],
            'fare_transfer_type': ['0', '1', '2'],
            'duration_limit_type': ['0', '1', '2', '3'],
            'cemv_support': ['0', '1', '2'],
            'table_name': ['agency', 'stops', 'routes', 'trips', 'stop_times', 'pathways', 'levels', 'feed_info', 'attributions'],
            'stop_access': ['0', '1'],
            'exception_type': ['1', '2'],
            'monday': ['0', '1'],
            'tuesday': ['0', '1'],
            'wednesday': ['0', '1'],
            'thursday': ['0', '1'],
            'friday': ['0', '1'],
            'saturday': ['0', '1'],
            'sunday': ['0', '1']
        };
        
        return enumValues[field] && enumValues[field].includes(value);
    }

    validateFieldType(value, fieldType, field, fileName) {
        if (value === '' || value === null || value === undefined) {
            return true; // Valores vacíos pueden ser válidos para campos opcionales
        }

        const validator = this.typeValidators[fieldType];
        if (!validator) {
            return true; // Si no hay validador, se considera válido
        }

        return validator(value, field, fileName);
    }

    async validateFile(filePath) {
        const fileName = path.basename(filePath);
        const errors = [];
        const warnings = [];
        let lineNumber = 0;
        let headers = [];

        try {
            const exists = await fs.pathExists(filePath);
            if (!exists) {
                errors.push(`Archivo no encontrado: ${fileName}`);
                return { fileName, errors, warnings, isValid: false };
            }

            return new Promise((resolve) => {
                fs.createReadStream(filePath)
                    .pipe(csv())
                    .on('headers', (headerList) => {
                        headers = headerList;
                        lineNumber++;
                        
                        const schema = this.fileSchemas[fileName];
                        if (schema) {
                            schema.required.forEach(field => {
                                if (!headers.includes(field)) {
                                    errors.push(`Línea 1: Campo requerido faltante: ${field}`);
                                }
                            });

                            headers.forEach(header => {
                                if (!schema.required.includes(header) && !schema.optional.includes(header)) {
                                    warnings.push(`Línea 1: Campo no reconocido: ${header}`);
                                }
                            });
                        }
                    })
                    .on('data', (row) => {
                        // Ignorar líneas vacías al final del archivo
                        const isEmptyRow = Object.keys(row).every(key => !row[key] || row[key].trim() === '');
                        if (isEmptyRow) {
                            return;
                        }
                        
                        lineNumber++;
                        
                        const schema = this.fileSchemas[fileName];
                        if (schema) {
                            // Validar campos requeridos no vacíos
                            schema.required.forEach(field => {
                                if (!row[field] || row[field].trim() === '') {
                                    errors.push(`Línea ${lineNumber + 1}: Campo requerido vacío: ${field}`);
                                }
                            });

                            // Validar tipos de datos para todos los campos
                            headers.forEach(header => {
                                const value = row[header];
                                if (value !== '' && value !== null && value !== undefined) {
                                    const fieldType = schema.types && schema.types[header];
                                    if (fieldType) {
                                        if (!this.validateFieldType(value, fieldType, header, fileName)) {
                                            errors.push(`Línea ${lineNumber + 1}: Tipo de dato inválido para ${header}. Se esperaba ${fieldType}, valor: ${value}`);
                                        }
                                    }
                                }
                            });

                            // Validaciones específicas por archivo
                            this.validateFileSpecificRules(fileName, row, lineNumber, errors);
                        }
                    })
                    .on('end', () => {
                        const isValid = errors.length === 0;
                        resolve({ fileName, errors, warnings, isValid, totalLines: lineNumber });
                    })
                    .on('error', (error) => {
                        errors.push(`Error leyendo archivo: ${error.message}`);
                        resolve({ fileName, errors, warnings, isValid: false });
                    });
            });
        } catch (error) {
            errors.push(`Error procesando archivo: ${error.message}`);
            return { fileName, errors, warnings, isValid: false };
        }
    }

    validateFileSpecificRules(fileName, row, lineNumber, errors) {
        switch (fileName) {
            case 'stops.txt':
                // Validar que si location_type es 1 (estación), debe tener stop_lat y stop_lon
                if (row.location_type === '1') {
                    if (!row.stop_lat || !row.stop_lon) {
                        errors.push(`Línea ${lineNumber + 1}: Estación (location_type=1) debe tener coordenadas stop_lat y stop_lon`);
                    }
                }
                // Validar que si parent_station está definido, location_type debe ser 0 o estar vacío
                if (row.parent_station && row.location_type && row.location_type !== '0') {
                    errors.push(`Línea ${lineNumber + 1}: location_type debe ser 0 o vacío cuando parent_station está definido`);
                }
                break;

            case 'routes.txt':
                // Validar que al menos route_short_name o route_long_name esté presente
                if (!row.route_short_name && !row.route_long_name) {
                    errors.push(`Línea ${lineNumber + 1}: Al menos route_short_name o route_long_name debe estar presente`);
                }
                // Validar colores si están presentes
                if (row.route_color && !this.validateFieldType(row.route_color, 'Color')) {
                    errors.push(`Línea ${lineNumber + 1}: route_color debe ser hexadecimal de 6 dígitos: ${row.route_color}`);
                }
                if (row.route_text_color && !this.validateFieldType(row.route_text_color, 'Color')) {
                    errors.push(`Línea ${lineNumber + 1}: route_text_color debe ser hexadecimal de 6 dígitos: ${row.route_text_color}`);
                }
                break;

            case 'stop_times.txt':
                // Validar que al menos stop_id o location_group_id o location_id esté presente
                if (!row.stop_id && !row.location_group_id && !row.location_id) {
                    errors.push(`Línea ${lineNumber + 1}: Al menos stop_id, location_group_id o location_id debe estar presente`);
                }
                // Validar que arrival_time y departure_time sean consistentes si ambos están presentes
                if (row.arrival_time && row.departure_time) {
                    // Solo validar si ambos son tiempos válidos
                    if (this.validateFieldType(row.arrival_time, 'Time') && this.validateFieldType(row.departure_time, 'Time')) {
                        // Las horas pueden ser iguales o departure_time >= arrival_time
                        // (no se puede validar fácilmente sin convertir a segundos)
                    }
                }
                break;

            case 'calendar.txt':
                // Validar que start_date <= end_date
                if (row.start_date && row.end_date) {
                    if (parseInt(row.start_date) > parseInt(row.end_date)) {
                        errors.push(`Línea ${lineNumber + 1}: start_date debe ser menor o igual a end_date`);
                    }
                }
                // Validar que al menos un día de la semana esté activo
                const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
                const hasActiveDay = days.some(day => row[day] === '1');
                if (!hasActiveDay) {
                    errors.push(`Línea ${lineNumber + 1}: Al menos un día de la semana debe estar activo (valor 1)`);
                }
                break;

            case 'shapes.txt':
                // Validar que shape_dist_traveled sea consistente con shape_pt_sequence
                if (row.shape_dist_traveled && row.shape_pt_sequence) {
                    const distance = parseFloat(row.shape_dist_traveled);
                    if (isNaN(distance) || distance < 0) {
                        errors.push(`Línea ${lineNumber + 1}: shape_dist_traveled debe ser un número no negativo: ${row.shape_dist_traveled}`);
                    }
                }
                break;

            case 'pathways.txt':
                // Validar que pathway_mode 7 (salida) no sea bidireccional
                if (row.pathway_mode === '7' && row.is_bidirectional === '1') {
                    errors.push(`Línea ${lineNumber + 1}: pathway_mode=7 (salida) no puede ser bidireccional`);
                }
                break;

            case 'fare_attributes.txt':
                // Validar que si transfers es vacío, significa transferencias ilimitadas
                if (row.transfers && row.transfers !== '' && !['0', '1', '2'].includes(row.transfers)) {
                    errors.push(`Línea ${lineNumber + 1}: transfers debe ser 0, 1, 2 o vacío: ${row.transfers}`);
                }
                break;

            case 'transfers.txt':
                // Validar combinaciones de campos según transfer_type
                if (row.transfer_type === '4' || row.transfer_type === '5') {
                    if (!row.from_trip_id || !row.to_trip_id) {
                        errors.push(`Línea ${lineNumber + 1}: transfer_type ${row.transfer_type} requiere from_trip_id y to_trip_id`);
                    }
                } else if (row.transfer_type === '1' || row.transfer_type === '2' || row.transfer_type === '3') {
                    if (!row.from_stop_id || !row.to_stop_id) {
                        errors.push(`Línea ${lineNumber + 1}: transfer_type ${row.transfer_type} requiere from_stop_id y to_stop_id`);
                    }
                }
                break;
        }
    }

    async validateAllFiles(extractedFiles) {
        const results = [];
        const foundFiles = extractedFiles.map(f => path.basename(f));
        
        // Validar archivos obligatorios
        const missingRequired = this.requiredFiles.filter(file => !foundFiles.includes(file));
        if (missingRequired.length > 0) {
            missingRequired.forEach(file => {
                results.push({
                    fileName: file,
                    errors: [`Archivo obligatorio faltante: ${file}`],
                    warnings: [],
                    isValid: false,
                    totalLines: 0
                });
            });
        }

        // Validar archivos condicionalmente obligatorios
        await this.validateConditionalRequirements(foundFiles, results);

        // Validar cada archivo encontrado
        for (const filePath of extractedFiles) {
            const fileName = path.basename(filePath);
            if (this.requiredFiles.includes(fileName) || 
                this.conditionalRequiredFiles.includes(fileName) || 
                this.optionalFiles.includes(fileName)) {
                const result = await this.validateFile(filePath);
                results.push(result);
            } else if (!fileName.endsWith('.geojson') && !fileName.endsWith('.txt')) {
                results.push({
                    fileName: fileName,
                    errors: [],
                    warnings: ['Archivo no reconocido en el estándar GTFS'],
                    isValid: true,
                    totalLines: 0
                });
            }
        }

        return results;
    }

    async validateConditionalRequirements(foundFiles, results) {
        // Validar stops.txt (obligatorio si no hay locations.geojson)
        if (!foundFiles.includes('stops.txt') && !foundFiles.includes('locations.geojson')) {
            results.push({
                fileName: 'stops.txt',
                errors: ['Archivo condicionalmente obligatorio faltante: stops.txt es obligatorio si no hay locations.geojson'],
                warnings: [],
                isValid: false,
                totalLines: 0
            });
        }

        // Validar calendar.txt/calendar_dates.txt (al menos uno debe existir)
        if (!foundFiles.includes('calendar.txt') && !foundFiles.includes('calendar_dates.txt')) {
            results.push({
                fileName: 'calendar.txt/calendar_dates.txt',
                errors: ['Al menos uno de calendar.txt o calendar_dates.txt es obligatorio'],
                warnings: [],
                isValid: false,
                totalLines: 0
            });
        }

        // Validar calendar_dates.txt (obligatorio si no hay calendar.txt)
        if (!foundFiles.includes('calendar.txt') && !foundFiles.includes('calendar_dates.txt')) {
            results.push({
                fileName: 'calendar_dates.txt',
                errors: ['Archivo condicionalmente obligatorio faltante: calendar_dates.txt es obligatorio si no hay calendar.txt'],
                warnings: [],
                isValid: false,
                totalLines: 0
            });
        }

        // Validar levels.txt (obligatorio si hay pathways.txt con pathway_mode=5)
        if (foundFiles.includes('pathways.txt')) {
            // Aquí se necesitaría leer el archivo para verificar si hay pathway_mode=5
            // Por ahora, lo agregamos como advertencia
            results.push({
                fileName: 'levels.txt',
                errors: [],
                warnings: ['levels.txt es obligatorio si pathways.txt contiene pathway_mode=5 (ascensores)'],
                isValid: true,
                totalLines: 0
            });
        }

        // Validar feed_info.txt (obligatorio si hay translations.txt)
        if (foundFiles.includes('translations.txt') && !foundFiles.includes('feed_info.txt')) {
            results.push({
                fileName: 'feed_info.txt',
                errors: ['Archivo condicionalmente obligatorio faltante: feed_info.txt es obligatorio si hay translations.txt'],
                warnings: [],
                isValid: false,
                totalLines: 0
            });
        }

        // Validar que no existan networks.txt/route_networks.txt si hay network_id en routes.txt
        if (foundFiles.includes('networks.txt') || foundFiles.includes('route_networks.txt')) {
            results.push({
                fileName: 'networks.txt/route_networks.txt',
                errors: ['Archivos condicionalmente prohibidos: networks.txt y route_networks.txt no deben existir si hay network_id en routes.txt'],
                warnings: [],
                isValid: false,
                totalLines: 0
            });
        }
    }
}

module.exports = GTFSValidator;