-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1:3307
-- Tiempo de generación: 31-12-2025 a las 01:56:02
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `prueba1`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `animales`
--

CREATE TABLE `animales` (
  `id` int(11) NOT NULL,
  `codigo_internounico` varchar(50) NOT NULL,
  `especie` enum('res','aves','cerdos','caballos') NOT NULL,
  `nombre` varchar(100) DEFAULT NULL,
  `sexo` enum('M','H') NOT NULL,
  `fecha_nacimiento` date DEFAULT NULL,
  `raza` varchar(100) DEFAULT NULL,
  `peso_inicial` decimal(10,2) DEFAULT NULL,
  `observaciones` text DEFAULT NULL,
  `foto_ruta` varchar(255) DEFAULT NULL,
  `id_granja` int(11) DEFAULT NULL,
  `id_galera` int(11) DEFAULT NULL,
  `estado` enum('Activo','Salido por mortandad','Salida por venta') DEFAULT 'Activo',
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `animales`
--

INSERT INTO `animales` (`id`, `codigo_internounico`, `especie`, `nombre`, `sexo`, `fecha_nacimiento`, `raza`, `peso_inicial`, `observaciones`, `foto_ruta`, `id_granja`, `id_galera`, `estado`, `fecha_creacion`) VALUES
(2, 'BOV-002', '', 'Zeus', 'M', NULL, NULL, NULL, 'Se retira el registro del inventario activo por venta directa.', NULL, 1, 1, 'Salida por venta', '2025-12-30 21:50:51'),
(3, 'VAC-100', 'res', 'Estrella', 'H', '2023-05-15', 'Holstein', NULL, NULL, NULL, 1, 1, 'Activo', '2025-12-30 22:03:56'),
(4, 'CAB-001', 'caballos', 'Sargento', 'M', '2023-05-15', 'A1', 450.50, 'Es bravo', NULL, 1, 3, 'Activo', '2025-12-30 22:06:21'),
(6, 'AVE-001', 'aves', 'Pollo', 'M', '2025-12-17', 'Peluco', 5.00, 'Registro desde Frontend', NULL, 1, 4, 'Activo', '2025-12-31 00:07:31');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `galeras`
--

CREATE TABLE `galeras` (
  `id` int(11) NOT NULL,
  `id_granja` int(11) DEFAULT NULL,
  `nombre` varchar(100) NOT NULL,
  `capacidad` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `galeras`
--

INSERT INTO `galeras` (`id`, `id_granja`, `nombre`, `capacidad`) VALUES
(1, 1, 'Galera 1', 0),
(2, 2, 'Galera 2', 0),
(3, 3, 'Galera 3', 0),
(4, 4, 'Galera 4', 0),
(5, 5, 'Galera 5', 0),
(6, 6, 'Galera 6', 0),
(7, 7, 'Galera 7', 0),
(8, 8, 'Galera 8', 0),
(9, 9, 'Galera 9', 0),
(10, 10, 'Galera 10', 0),
(11, 11, 'Galera 11', 0),
(12, NULL, 'Galera 12', 0),
(13, NULL, 'Galera 13', 0),
(14, NULL, 'Galera 14', 0),
(15, NULL, 'Galera 15', 0),
(16, NULL, 'Galera 16', 0),
(17, NULL, 'Galera 17', 0),
(18, NULL, 'Galera 18', 0),
(19, NULL, 'Galera 19', 0),
(20, NULL, 'Galera 20', 0),
(21, NULL, 'Galera 21', 0),
(22, NULL, 'Galera 22', 0),
(23, NULL, 'Galera 23', 0),
(24, NULL, 'Galera 24', 0),
(25, NULL, 'Galera 25', 0),
(26, NULL, 'Galera 26', 0),
(27, NULL, 'Galera 27', 0),
(28, NULL, 'Galera 28', 0),
(29, NULL, 'Galera 29', 0),
(30, NULL, 'Galera 30', 0),
(31, NULL, 'Galera 31', 0),
(32, NULL, 'Galera 32', 0),
(33, NULL, 'Galera 33', 0),
(34, NULL, 'Galera 34', 0),
(35, NULL, 'Galera 35', 0),
(36, NULL, 'Galera 36', 0),
(37, NULL, 'Galera 37', 0),
(38, NULL, 'Galera 38', 0),
(39, NULL, 'Galera 39', 0),
(40, NULL, 'Galera 40', 0),
(41, NULL, 'Galera 41', 0),
(42, NULL, 'Galera 42', 0),
(43, NULL, 'Galera 43', 0),
(44, NULL, 'Galera 44', 0),
(45, NULL, 'Galera 45', 0),
(46, NULL, 'Galera 46', 0),
(47, NULL, 'Galera 47', 0),
(48, NULL, 'Galera 48', 0),
(49, NULL, 'Galera 49', 0),
(50, NULL, 'Galera 50', 0),
(51, NULL, 'Galera 51', 0),
(52, NULL, 'Galera 52', 0),
(53, NULL, 'Galera 53', 0),
(54, NULL, 'Galera 54', 0),
(55, NULL, 'Galera 55', 0),
(56, NULL, 'Galera 56', 0),
(57, NULL, 'Galera 57', 0),
(58, NULL, 'Galera 58', 0),
(60, NULL, 'Galera 60', 0),
(61, NULL, 'Galera 61', 0),
(62, NULL, 'Galera 62', 0),
(63, NULL, 'Galera 63', 0),
(64, NULL, 'Galera 64', 0),
(65, NULL, 'Galera 65', 0),
(66, NULL, 'Galera 66', 0),
(67, NULL, 'Galera 67', 0),
(68, NULL, 'Galera 68', 0),
(69, NULL, 'Galera 69', 0),
(70, NULL, 'Galera 70', 0),
(71, NULL, 'Galera 71', 0),
(72, NULL, 'Galera 72', 0),
(73, NULL, 'Galera 73', 0),
(74, NULL, 'Galera 74', 0),
(75, NULL, 'Galera 75', 0),
(76, NULL, 'Galera 76', 0),
(77, NULL, 'Galera 77', 0),
(78, NULL, 'Galera 78', 0),
(79, NULL, 'Galera 79', 0),
(80, NULL, 'Galera 80', 0),
(81, NULL, 'Galera 81', 0),
(82, NULL, 'Galera 82', 0),
(83, NULL, 'Galera 83', 0),
(84, NULL, 'Galera 84', 0),
(85, NULL, 'Galera 85', 0),
(86, NULL, 'Galera 86', 0),
(87, NULL, 'Galera 87', 0),
(88, NULL, 'Galera 88', 0),
(89, NULL, 'Galera 89', 0),
(90, NULL, 'Galera 90', 0),
(91, NULL, 'Galera 91', 0),
(92, NULL, 'Galera 92', 0),
(93, NULL, 'Galera 93', 0),
(94, NULL, 'Galera 94', 0),
(95, NULL, 'Galera 95', 0),
(96, NULL, 'Galera 96', 0),
(97, NULL, 'Galera 97', 0),
(98, NULL, 'Galera 98', 0),
(99, NULL, 'Galera 99', 0),
(100, NULL, 'Galera 100', 0),
(101, NULL, 'Galera 101', 0),
(102, NULL, 'Galera 102', 0),
(108, NULL, 'Galera 108', 0),
(109, NULL, 'Galera 109', 0),
(110, NULL, 'Galera 110', 0),
(111, NULL, 'Galera 111', 0),
(112, NULL, 'Galera 112', 0),
(113, NULL, 'Galera 113', 0),
(114, NULL, 'Galera 114', 0),
(115, NULL, 'Galera 115', 0),
(116, NULL, 'Galera 116', 0),
(117, NULL, 'Galera 117', 0),
(118, NULL, 'Galera 118', 0),
(119, NULL, 'Galera 119', 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `granjas`
--

CREATE TABLE `granjas` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `ubicacion` varchar(255) DEFAULT NULL,
  `ultima_sincronizacion` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `granjas`
--

INSERT INTO `granjas` (`id`, `nombre`, `ubicacion`, `ultima_sincronizacion`) VALUES
(1, 'Granja 1', 'Sin ubicación', '2025-12-30 15:25:29'),
(2, 'Granja 2', 'Sin ubicación', '2025-12-30 15:25:29'),
(3, 'Granja 3', 'Sin ubicación', '2025-12-30 15:25:29'),
(4, 'Granja 4', 'Sin ubicación', '2025-12-30 15:25:29'),
(5, 'Granja 5', 'Sin ubicación', '2025-12-30 15:25:29'),
(6, 'Granja 6', 'Sin ubicación', '2025-12-30 15:25:29'),
(7, 'Granja 7', 'Sin ubicación', '2025-12-30 15:25:29'),
(8, 'Granja 8', 'Sin ubicación', '2025-12-30 15:25:29'),
(9, 'Granja 9', 'Sin ubicación', '2025-12-30 15:25:29'),
(10, 'Granja 10', 'Sin ubicación', '2025-12-30 15:25:29'),
(11, 'Granja 11', 'Sin ubicación', '2025-12-30 15:25:29'),
(12, 'Granja 12', 'Sin ubicación', '2025-12-30 15:25:29'),
(16, 'Granja 16', 'Sin ubicación', '2025-12-30 15:25:29'),
(19, 'Granja 19', 'Sin ubicación', '2025-12-30 15:25:29');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `logs_sincronizacion`
--

CREATE TABLE `logs_sincronizacion` (
  `id` int(11) NOT NULL,
  `modulo` varchar(50) DEFAULT NULL,
  `resultado` varchar(255) DEFAULT NULL,
  `detalles` text DEFAULT NULL,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `logs_sincronizacion`
--

INSERT INTO `logs_sincronizacion` (`id`, `modulo`, `resultado`, `detalles`, `fecha`) VALUES
(1, 'General', 'Éxito', 'Sincronizadas 14 granjas y 113 galeras.', '2025-12-30 21:25:30');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `movimientos`
--

CREATE TABLE `movimientos` (
  `id` int(11) NOT NULL,
  `id_animal` int(11) DEFAULT NULL,
  `tipo_movimiento` enum('ingreso','traslado','mortalidad','venta') NOT NULL,
  `fecha_hora` timestamp NOT NULL DEFAULT current_timestamp(),
  `id_granja_origen` int(11) DEFAULT NULL,
  `id_galera_origen` int(11) DEFAULT NULL,
  `id_granja_destino` int(11) DEFAULT NULL,
  `id_galera_destino` int(11) DEFAULT NULL,
  `nota` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `movimientos`
--

INSERT INTO `movimientos` (`id`, `id_animal`, `tipo_movimiento`, `fecha_hora`, `id_granja_origen`, `id_galera_origen`, `id_granja_destino`, `id_galera_destino`, `nota`) VALUES
(2, 2, 'ingreso', '2025-12-30 21:50:51', NULL, NULL, 1, 1, 'Registro inicial'),
(4, 3, 'ingreso', '2025-12-30 22:03:56', NULL, NULL, 1, 1, 'Ingreso inicial al sistema'),
(5, 4, 'ingreso', '2025-12-30 22:06:21', NULL, NULL, 1, 3, 'Ingreso inicial al sistema'),
(7, 2, '', '2025-12-30 22:33:20', NULL, NULL, 1, 1, 'BAJA POR: Salida por venta. Detalle: Se retira el registro del inventario activo por venta directa. (Registrado por Usuario ID: 3)'),
(8, 6, 'ingreso', '2025-12-31 00:07:31', NULL, NULL, 1, 4, 'Ingreso inicial al sistema');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `rol` enum('Admin','Usuario') DEFAULT 'Usuario'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `nombre`, `email`, `password`, `rol`) VALUES
(1, 'byron', 'byrongonzalez@gmail.com', '123456', 'Admin'),
(2, 'byrong', 'byrong@gmail.com', '123456', 'Admin'),
(3, 'Alberto', 'alberto@gmail.com', '123456', 'Usuario');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `animales`
--
ALTER TABLE `animales`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `codigo_internounico` (`codigo_internounico`),
  ADD KEY `id_granja` (`id_granja`),
  ADD KEY `id_galera` (`id_galera`);

--
-- Indices de la tabla `galeras`
--
ALTER TABLE `galeras`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_granja` (`id_granja`);

--
-- Indices de la tabla `granjas`
--
ALTER TABLE `granjas`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `logs_sincronizacion`
--
ALTER TABLE `logs_sincronizacion`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `movimientos`
--
ALTER TABLE `movimientos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_animal` (`id_animal`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `animales`
--
ALTER TABLE `animales`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `logs_sincronizacion`
--
ALTER TABLE `logs_sincronizacion`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `movimientos`
--
ALTER TABLE `movimientos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `animales`
--
ALTER TABLE `animales`
  ADD CONSTRAINT `animales_ibfk_1` FOREIGN KEY (`id_granja`) REFERENCES `granjas` (`id`),
  ADD CONSTRAINT `animales_ibfk_2` FOREIGN KEY (`id_galera`) REFERENCES `galeras` (`id`);

--
-- Filtros para la tabla `galeras`
--
ALTER TABLE `galeras`
  ADD CONSTRAINT `galeras_ibfk_1` FOREIGN KEY (`id_granja`) REFERENCES `granjas` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `movimientos`
--
ALTER TABLE `movimientos`
  ADD CONSTRAINT `movimientos_ibfk_1` FOREIGN KEY (`id_animal`) REFERENCES `animales` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
