# Especificación: Listar Proyectos

Feature: Listado de Proyectos
  Como usuario del sistema
  Quiero ver una lista de todos los proyectos registrados
  Para poder gestionarlos, editarlos o eliminarlos

  Scenario: Visualizar proyectos exitosamente
    Given que existen proyectos registrados en el servidor
    When el usuario navega a la pantalla de lista de proyectos ("/projects/list")
    Then se debe mostrar una tabla con las columnas: ID, Nombre, Fechas, Estado, Descripción y Acciones
    And la información de cada proyecto debe aparecer estructurada en filas

  Scenario: Lista de proyectos vacía
    Given que el servidor no tiene proyectos registrados
    When el usuario navega a la pantalla de lista de proyectos
    Then se debe mostrar un "Empty State" amigable indicando "No hay proyectos creados aún."
    And debe aparecer un enlace visible hacia la ruta de creación de proyectos

  Scenario: Error de red o servidor al cargar
    Given que hay un problema de red o el servidor responde con error
    When el componente intenta cargar la lista
    Then se debe atrapar el error mediante el servicio
    And se debe mostrar un texto en color rojo con el mensaje del error devuelto (ej. "No se pudo conectar al servidor")


> *Nota: Este documento de especificación y su respectivo código fueron generados íntegramente por **Antigravity** (Asistente de IA).*

