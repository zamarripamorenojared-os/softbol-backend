# type: ignore
# pyrefly: ignore[missing-import]
import docx  # type: ignore # noqa: F401
from docx.shared import Pt, RGBColor  # type: ignore # noqa: F401
from docx.enum.text import WD_ALIGN_PARAGRAPH  # type: ignore # noqa: F401
from docx.enum.table import WD_TABLE_ALIGNMENT  # type: ignore # noqa: F401
from docx.oxml import OxmlElement  # type: ignore # noqa: F401
from docx.oxml.ns import qn  # type: ignore # noqa: F401

def set_cell_background(cell, hex_color):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = OxmlElement('w:shd')
    shd.set(qn('w:val'), 'clear')
    shd.set(qn('w:color'), 'auto')
    shd.set(qn('w:fill'), hex_color)
    tcPr.append(shd)

def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = OxmlElement('w:tcMar')
    for m, val in [('top', top), ('bottom', bottom), ('left', left), ('right', right)]:
        node = OxmlElement(f'w:{m}')
        node.set(qn('w:w'), str(val))
        node.set(qn('w:type'), 'dxa')
        tcMar.append(node)
    tcPr.append(tcMar)

def add_header(doc, title, subtitle, chapter_badge):
    header_table = doc.add_table(rows=1, cols=1)
    header_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    cell = header_table.cell(0, 0)
    set_cell_background(cell, "0F2744") # Dark navy blue
    set_cell_margins(cell, top=200, bottom=200, left=250, right=250)
    
    p = cell.paragraphs[0]
    p.alignment = WD_ALIGN_PARAGRAPH.LEFT
    run_badge = p.add_run(f" {chapter_badge} \n")
    run_badge.font.name = "Segoe UI"
    run_badge.font.size = Pt(10)
    run_badge.font.bold = True
    run_badge.font.color.rgb = RGBColor(0x38, 0xBD, 0xF8) # Sky blue
    
    run_title = p.add_run(title + "\n")
    run_title.font.name = "Segoe UI"
    run_title.font.size = Pt(20)
    run_title.font.bold = True
    run_title.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)
    
    run_sub = p.add_run(subtitle)
    run_sub.font.name = "Segoe UI"
    run_sub.font.size = Pt(11)
    run_sub.font.color.rgb = RGBColor(0x94, 0xA3, 0xB8)
    
    doc.add_paragraph() # Spacing

def add_section_title(doc, text):
    h = doc.add_heading(level=1)
    run = h.add_run(text)
    run.font.name = "Segoe UI Semibold"
    run.font.size = Pt(15)
    run.font.color.rgb = RGBColor(0x0F, 0x27, 0x44)
    run.font.bold = True
    p = doc.paragraphs[-1]
    p.paragraph_format.space_before = Pt(14)
    p.paragraph_format.space_after = Pt(4)

def add_sub_title(doc, text):
    h = doc.add_heading(level=2)
    run = h.add_run(text)
    run.font.name = "Segoe UI"
    run.font.size = Pt(12)
    run.font.color.rgb = RGBColor(0x02, 0x84, 0xC7)
    run.font.bold = True
    p = doc.paragraphs[-1]
    p.paragraph_format.space_before = Pt(10)
    p.paragraph_format.space_after = Pt(3)

def add_body_paragraph(doc, text, bold_prefix=""):
    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(6)
    p.paragraph_format.line_spacing = 1.15
    if bold_prefix:
        r_pre = p.add_run(bold_prefix + ": ")
        r_pre.font.name = "Segoe UI"
        r_pre.font.size = Pt(10.5)
        r_pre.font.bold = True
        r_pre.font.color.rgb = RGBColor(0x1E, 0x29, 0x3B)
    r = p.add_run(text)
    r.font.name = "Segoe UI"
    r.font.size = Pt(10.5)
    r.font.color.rgb = RGBColor(0x33, 0x41, 0x55)
    return p

def add_bullet_point(doc, text, bold_title=""):
    p = doc.add_paragraph(style='List Bullet')
    p.paragraph_format.space_after = Pt(3)
    p.paragraph_format.line_spacing = 1.15
    if bold_title:
        r_title = p.add_run(bold_title + ": ")
        r_title.font.name = "Segoe UI"
        r_title.font.size = Pt(10)
        r_title.font.bold = True
        r_title.font.color.rgb = RGBColor(0x0F, 0x27, 0x44)
    r = p.add_run(text)
    r.font.name = "Segoe UI"
    r.font.size = Pt(10)
    r.font.color.rgb = RGBColor(0x33, 0x41, 0x55)

def add_table_data(doc, headers, data):
    table = doc.add_table(rows=len(data) + 1, cols=len(headers))
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    # Header row
    hdr_cells = table.rows[0].cells
    for i, title in enumerate(headers):
        hdr_cells[i].text = title
        set_cell_background(hdr_cells[i], "1E293B")
        set_cell_margins(hdr_cells[i], top=80, bottom=80, left=100, right=100)
        p = hdr_cells[i].paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        for run in p.runs:
            run.font.name = "Segoe UI"
            run.font.size = Pt(9.5)
            run.font.bold = True
            run.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)
            
    # Data rows
    for row_idx, row_data in enumerate(data):
        row_cells = table.rows[row_idx + 1].cells
        bg_col = "F8FAFC" if row_idx % 2 == 0 else "FFFFFF"
        for col_idx, text in enumerate(row_data):
            row_cells[col_idx].text = str(text)
            set_cell_background(row_cells[col_idx], bg_col)
            set_cell_margins(row_cells[col_idx], top=60, bottom=60, left=80, right=80)
            p = row_cells[col_idx].paragraphs[0]
            if col_idx == 0:
                p.alignment = WD_ALIGN_PARAGRAPH.LEFT
            else:
                p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            for run in p.runs:
                run.font.name = "Segoe UI"
                run.font.size = Pt(9)
                run.font.color.rgb = RGBColor(0x1E, 0x29, 0x3B)
    doc.add_paragraph() # Spacing

# ==========================================
# GENERATE DOC 7: CAPÍTULOS 16 Y 17
# ==========================================
def generate_doc_16_17():
    doc = docx.Document()
    
    add_header(
        doc,
        "DOCUMENTACIÓN TÉCNICA - CAPÍTULOS 16 Y 17",
        "Sistema de Gestión de Proyectos (PMS) | Mensajería Asíncrona con RabbitMQ y Procesamiento de Flujos con CDC / Event Sourcing",
        "ENTREGA TÉCNICA - FASE 7"
    )
    
    add_section_title(doc, "1. Introducción a las Arquitecturas Orientadas a Eventos (Capítulo 16)")
    add_body_paragraph(
        doc,
        "A medida que una plataforma como el Sistema de Gestión de Proyectos (PMS) evoluciona hacia una arquitectura distribuida de microservicios, las llamadas síncronas directas HTTP/REST generan cuellos de botella de latencia, acoplamiento temporal y fragilidad en cascada. Las Arquitecturas Orientadas a Eventos (EDA) resuelven este desafío desacoplando al emisor del receptor mediante brokers de mensajería."
    )
    
    headers_comm = ["Criterio de Evaluación", "Comunicación Síncrona (HTTP/REST)", "Comunicación Asíncrona (Brokers)"]
    data_comm = [
        ["Acoplamiento Temporal", "Alto: Ambos servicios deben estar en línea al mismo instante.", "Nulo: El receptor consume los mensajes cuando esté disponible."],
        ["Latencia Percibida", "Suma de las latencias de red y del servidor destino.", "Inmediata: Solo toma el tiempo de publicación al broker."],
        ["Tolerancia a Fallos", "Baja: Requiere circuitos de corte (Circuit Breakers).", "Alta: El broker retiene mensajes en colas de persistencia."],
        ["Escalabilidad", "Vertical o limitada por el tiempo de respuesta del receptor.", "Horizontal: Múltiples consumidores absorben ráfagas elásticas."]
    ]
    add_table_data(doc, headers_comm, data_comm)

    add_section_title(doc, "2. Patrones Fundamentales de Mensajería y Distribución")
    add_bullet_point(doc, "El emisor produce un mensaje sin esperar confirmación del consumidor. Idóneo para registros de auditoría y telemetría de eventos.", "Mensaje de una sola vía (Fire and Forget)")
    add_bullet_point(doc, "El emisor adjunta un 'Correlation ID' y una dirección temporal 'Reply-To Address', permitiendo enlazar la respuesta asíncrona a la solicitud original sin bloquear hilos.", "Solicitud y Respuesta Asíncrona (Async Request/Reply)")
    add_bullet_point(doc, "Topología uno-a-muchos (1:N) donde un publicador emite a un intercambiador (Exchange) y el broker duplica y distribuye hacia múltiples colas de suscriptores independientes mediante claves de enrutamiento.", "Publicación y Suscripción (Publish/Subscribe)")
    add_bullet_point(doc, "Múltiples instancias del mismo microservicio comparten una cola única. El broker reparte mensajes mediante algoritmo Round-Robin o con 'prefetch = 1' para balancear la carga.", "Consumidores Competidores (Competing Consumers)")

    add_section_title(doc, "3. Comparativa Técnica de Brokers: Redis, RabbitMQ y Kafka")
    headers_brokers = ["Característica", "Redis Pub/Sub", "RabbitMQ (AMQP 0-9-1)", "Apache Kafka"]
    data_brokers = [
        ["Modelo de Mensajes", "Push efímero en memoria.", "Push a colas con confirmación manual (ACK).", "Pull sobre registro de confirmación (Log)."],
        ["Persistencia", "No (mensajes se pierden si no hay suscriptor).", "Sí (configurable por cola e intercambiador duradero).", "Sí (persistencia distribuida en disco de solo anexado)."],
        ["Enrutamiento", "Canales de texto simples.", "Exchanges avanzados (Topic, Direct, Fanout, Headers).", "Tópicos divididos en particiones distribuidas."],
        ["Caso de Uso", "Notificaciones WebSocket efímeras en vivo.", "Microservicios de negocio y transacciones desacopladas.", "Big Data, streaming analítico y Event Sourcing masivo."]
    ]
    add_table_data(doc, headers_brokers, data_brokers)

    add_section_title(doc, "4. Implementación del Caso Práctico con RabbitMQ en el PMS")
    add_body_paragraph(
        doc,
        "En el PMS se implementó un flujo completo de publicación y consumo desacoplado en 'src/messaging/':",
        "Módulos Creados"
    )
    add_bullet_point(doc, "Clase singleton 'RabbitMQConnection' encargada de administrar la conexión TCP y declarar el intercambiador de tipo topic 'pms_events_exchange' con durabilidad activada.", "Conexión Central (rabbitmq_connection.ts)")
    add_bullet_point(doc, "Clase 'EventPublisher' con el método 'publishTaskCreated' que serializa el evento 'TaskCreatedEvent' y lo despacha con clave 'task.event.created' y 'persistent: true'.", "Publicador de Eventos (event_publisher.ts)")
    add_bullet_point(doc, "Enlaza la cola 'notification_service_queue' al patrón 'task.event.*', garantizando procesamiento equitativo con 'prefetch(1)' y confirmación explícita con 'channel.ack()'.", "Consumidor de Notificaciones (notification_consumer.ts)")
    add_bullet_point(doc, "Enlaza la cola 'audit_service_queue' al comodín global '#' para registrar en tiempo real todos los eventos que ocurren en el sistema.", "Consumidor de Auditoría (audit_consumer.ts)")

    add_section_title(doc, "5. Procesamiento de Flujos de Eventos y CDC (Capítulo 17)")
    add_body_paragraph(
        doc,
        "Basado en los principios de Martin Kleppmann en 'Designing Data-Intensive Applications', se analizó la transición de bases de datos mutables hacia flujos de eventos continuos e inmutables. El estado actual de una entidad no es más que la acumulación de todos sus hechos históricos pasados.",
        "Fundamentos de Stream Processing"
    )
    add_body_paragraph(
        doc,
        "La Captura de Cambios de Datos (CDC) extrae continuamente mutaciones (INSERT, UPDATE, DELETE) desde el registro de transacciones (WAL de PostgreSQL) sin saturar las consultas de la aplicación con encuestas periódicas (polling). Esto permite sincronizar índices en Elasticsearch, cachés en Redis y Data Lakes analíticos en tiempo real.",
        "Change Data Capture (CDC)"
    )

    add_section_title(doc, "6. Event Sourcing y Segregación de Responsabilidad (CQRS)")
    add_body_paragraph(
        doc,
        "En 'src/events/stream_processor.ts' se implementó la arquitectura de Event Sourcing combinada con CQRS:",
        "Arquitectura de Eventos"
    )
    add_bullet_point(doc, "Almacén inmutable 'EventStore' que guarda eventos congelados ('Object.freeze') como 'TaskCreated' y 'TaskCompleted', permitiendo auditoría absoluta y viaje en el tiempo (time travel).", "Event Sourcing")
    add_bullet_point(doc, "El proyector 'ProjectAnalyticsProjector' actúa como el Read Model de CQRS, suscribiéndose a los eventos de dominio y manteniendo en tiempo real contadores agregados ('activeTasks', 'completedTasks', 'totalProcessed') sin ejecutar consultas pesadas en la base de datos transaccional.", "Modelo de Lectura CQRS")
    add_bullet_point(doc, "Se analizaron las garantías de entrega (At-most-once, At-least-once y Exactly-once) y el particionamiento en ventanas temporales fijas (tumbling), deslizantes (sliding) y de sesión (session windows).", "Semántica y Ventanas Temporales")

    doc.save("c:/Users/Usuario General/Desktop/miniproyecto/Documentacion_Capitulo_16_y_17.docx")
    print("Guardado exitoso: Documentacion_Capitulo_16_y_17.docx")

# ==========================================
# GENERATE DOC 8: CAPÍTULO 18
# ==========================================
def generate_doc_18():
    doc = docx.Document()
    
    add_header(
        doc,
        "DOCUMENTACIÓN TÉCNICA - CAPÍTULO 18",
        "Sistema de Gestión de Proyectos (PMS) | Optimización del Event Loop de Libuv, Worker Threads y Procesos Hijo",
        "ENTREGA TÉCNICA - FASE 8"
    )
    
    add_section_title(doc, "1. La Arquitectura de Ejecución en Node.js y el Mito del Monohilo")
    add_body_paragraph(
        doc,
        "Existe la concepción errónea de que Node.js es estrictamente monohilo. Si bien el código JavaScript se ejecuta en un único hilo dentro del motor Google V8, la plataforma completa es intrínsecamente multihilo gracias a la biblioteca libuv. Node.js delega el trabajo pesado al I/O asíncrono no bloqueante nativo del sistema operativo (epoll/kqueue/IOCP) y al Thread Pool de libuv (4 hilos por defecto, ampliable hasta 1024 con UV_THREADPOOL_SIZE para fs, DNS y criptografía)."
    )

    add_section_title(doc, "2. Fases Detalladas del Event Loop de Libuv y Jerarquía de Microtareas")
    headers_phases = ["Fase del Event Loop", "Mecanismo Interno", "Operaciones Ejecutadas"]
    data_phases = [
        ["1. Temporizadores (Timers)", "Heap de temporizadores expirados.", "Ejecuta callbacks de setTimeout() y setInterval()."],
        ["2. Callbacks Pendientes", "Cola de errores de E/S diferidos.", "Notificaciones de sockets TCP reportadas por el SO."],
        ["3. Inactivo / Preparación", "Coordinación interna de libuv.", "Fase de preparación previa a la inspección de E/S."],
        ["4. Sondeo (Poll)", "Bloqueo calculado de inspección.", "Procesa lecturas y escrituras de red y ficheros."],
        ["5. Verificación (Check)", "Ejecución inmediata post-sondeo.", "Ejecuta callbacks programados con setImmediate()."],
        ["6. Callbacks de Cierre", "Cierres formales de recursos.", "Callbacks de eventos socket.on('close')."]
    ]
    add_table_data(doc, headers_phases, data_phases)

    add_body_paragraph(
        doc,
        "Entre cada fase del bucle, Node.js procesa la cola de microtareas con prioridad absoluta sobre libuv. La cola de 'process.nextTick()' posee la prioridad más alta de todo el entorno, ejecutándose inmediatamente antes de las Promesas. Se documentó el riesgo de hambruna (starvation) del bucle si se abusa recursivamente de nextTick(). En 'src/perf/event_loop_demo.ts' se programó la demostración del orden exacto de ejecución.",
        "Jerarquía de Microtareas"
    )

    add_section_title(doc, "3. Diagnóstico de Bloqueos con EventLoopUtilization (ELU)")
    add_body_paragraph(
        doc,
        "Si un cálculo síncrono tarda 200ms en el hilo principal, la API no puede atender ninguna petición concurrente. En 'src/perf/elu_diagnostic.ts' se implementó la medición sub-milisegunda mediante 'performance.eventLoopUtilization()' de 'node:perf_hooks', permitiendo calcular con exactitud el porcentaje de ocupación, tiempo activo y tiempo ocioso del event loop.",
        "Métricas de Utilización"
    )

    add_section_title(doc, "4. Multiprocesamiento con Procesos Hijo (child_process)")
    add_body_paragraph(
        doc,
        "Para aislar tareas intensivas de CPU con su propio montón de memoria y bucle de eventos independiente, se utilizó el módulo 'child_process':",
        "Estrategias de Aislamiento"
    )
    add_bullet_point(doc, "Ejecuta comandos de shell en un búfer acotado en memoria.", "exec() y execFile()")
    add_bullet_point(doc, "Genera nuevos procesos transmitiendo datos mediante Streams para alto volumen.", "spawn()")
    add_bullet_point(doc, "Implementado en 'src/services/heavy_calc_process.ts'. Crea un proceso secundario Node.js con canal de comunicación bidireccional IPC (Inter-Process Communication) nativo.", "fork()")

    add_section_title(doc, "5. Paralelismo Multihilo con Worker Threads y Memoria Compartida")
    add_body_paragraph(
        doc,
        "El módulo nativo 'worker_threads' permite ejecutar múltiples hilos JavaScript aislados dentro del mismo proceso Node.js, reduciendo drásticamente el consumo de memoria respecto a los procesos hijo.",
        "Hilos Livianos"
    )
    add_body_paragraph(
        doc,
        "En 'src/workers/shared_memory_demo.ts' se implementó la compartición de memoria de alto rendimiento mediante 'SharedArrayBuffer' y el objeto 'Atomics', realizando incrementos hilo-seguros ('Atomics.add') sin el costo de serializar o copiar datos por mensajes.",
        "Memoria Compartida y Atomics"
    )

    add_section_title(doc, "6. Implementación del Patrón WorkerPool Reutilizable en el PMS")
    add_body_paragraph(
        doc,
        "Para evitar la sobrecarga de instanciar y destruir hilos por cada solicitud HTTP entrante, se desarrolló la clase 'WorkerPool' en 'src/utils/worker_pool.ts':",
        "Pool de Trabajadores"
    )
    add_bullet_point(doc, "Inicializa un grupo fijo de hilos (numberOfThreads) manteniéndolos en caliente en la lista de 'freeWorkers'.", "Hilos en Espera (Warm Threads)")
    add_bullet_point(doc, "Encola solicitudes entrantes ('taskQueue') y las despacha de inmediato al primer hilo disponible.", "Cola de Tareas No Bloqueante")
    add_bullet_point(doc, "Si un worker experimenta una excepción crítica, el evento 'error' lo reemplaza automáticamente creando un hilo nuevo en el pool.", "Tolerancia a Fallos y Auto-Recuperación")
    add_bullet_point(doc, "En 'src/controllers/analytics_controller.ts' se conectó el endpoint '/api/projects/:projectId/metrics' al WorkerPool apuntando a 'src/workers/analytics_worker.js' para procesar muestras masivas de 500,000 elementos sin elevar la latencia de la API Express.", "Integración en Express")

    doc.save("c:/Users/Usuario General/Desktop/miniproyecto/Documentacion_Capitulo_18.docx")
    print("Guardado exitoso: Documentacion_Capitulo_18.docx")

if __name__ == "__main__":
    generate_doc_16_17()
    generate_doc_18()
