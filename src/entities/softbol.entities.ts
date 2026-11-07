import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
  Index
} from 'typeorm';

// 1. TorneoSoftbol
@Entity('torneos_softbol')
export class TorneoSoftbolEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 120 })
  nombre!: string;

  @Column({ type: 'varchar', length: 50 })
  temporada!: string;

  @Column({ type: 'date', nullable: true })
  fecha_inicio!: string;

  @Column({ type: 'date', nullable: true })
  fecha_fin!: string;

  @Column({ type: 'varchar', length: 30, default: 'Activo' })
  estado!: string;

  @OneToMany(() => EquipoSoftbolEntity, (equipo) => equipo.torneo)
  equipos!: EquipoSoftbolEntity[];

  @OneToMany(() => JuegoSoftbolEntity, (juego) => juego.torneo)
  juegos!: JuegoSoftbolEntity[];

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}

// 2. CategoriaSoftbol
@Entity('categorias_softbol')
export class CategoriaSoftbolEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 80, unique: true })
  nombre!: string;

  @Column({ type: 'varchar', length: 20, default: 'Libre' })
  genero!: string; // Varonil, Femenil, Mixto

  @Column({ type: 'int', default: 0 })
  limite_edad!: number;

  @OneToMany(() => EquipoSoftbolEntity, (equipo) => equipo.categoria)
  equipos!: EquipoSoftbolEntity[];

  @CreateDateColumn()
  created_at!: Date;
}

// 3. EquipoSoftbol
@Entity('equipos_softbol')
export class EquipoSoftbolEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 100 })
  nombre!: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  abreviatura!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  logo_url!: string;

  @ManyToOne(() => TorneoSoftbolEntity, (torneo) => torneo.equipos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'torneo_id' })
  torneo!: TorneoSoftbolEntity;

  @Column({ type: 'uuid', nullable: true })
  torneo_id!: string;

  @ManyToOne(() => CategoriaSoftbolEntity, (cat) => cat.equipos, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'categoria_id' })
  categoria!: CategoriaSoftbolEntity;

  @Column({ type: 'uuid', nullable: true })
  categoria_id!: string;

  @OneToMany(() => RosterJugadorEntity, (jugador) => jugador.equipo)
  jugadores!: RosterJugadorEntity[];

  @CreateDateColumn()
  created_at!: Date;
}

// 4. RosterJugador con Índice B-Tree Compuesto (equipo_id, posicion)
@Entity('roster_jugadores')
@Index('idx_jugadores_equipo_posicion', ['equipo_id', 'posicion'])
export class RosterJugadorEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 100 })
  nombre!: string;

  @Column({ type: 'int', default: 0 })
  numero_dorsal!: number;

  @Column({ type: 'varchar', length: 30, default: 'Outfielder' })
  posicion!: string;

  @ManyToOne(() => EquipoSoftbolEntity, (equipo) => equipo.jugadores, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'equipo_id' })
  equipo!: EquipoSoftbolEntity;

  @Column({ type: 'uuid' })
  equipo_id!: string;

  @OneToMany(() => EstadisticaBateoEntity, (est) => est.jugador)
  estadisticas!: EstadisticaBateoEntity[];

  @CreateDateColumn()
  created_at!: Date;
}

// 5. JuegoSoftbol con Índice B-Tree Compuesto (torneo_id, fecha_juego)
@Entity('juegos_softbol')
@Index('idx_juegos_torneo_fecha', ['torneo_id', 'fecha_juego'])
export class JuegoSoftbolEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => TorneoSoftbolEntity, (torneo) => torneo.juegos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'torneo_id' })
  torneo!: TorneoSoftbolEntity;

  @Column({ type: 'uuid' })
  torneo_id!: string;

  @ManyToOne(() => EquipoSoftbolEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'equipo_local_id' })
  equipo_local!: EquipoSoftbolEntity;

  @Column({ type: 'uuid' })
  equipo_local_id!: string;

  @ManyToOne(() => EquipoSoftbolEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'equipo_visitante_id' })
  equipo_visitante!: EquipoSoftbolEntity;

  @Column({ type: 'uuid' })
  equipo_visitante_id!: string;

  @Column({ type: 'timestamp' })
  fecha_juego!: Date;

  @Column({ type: 'varchar', length: 100, default: 'Campo Principal UAS' })
  campo!: string;

  @Column({ type: 'varchar', length: 30, default: 'Programado' })
  estado!: string; // Programado, En_Calentamiento, Innings_En_Juego, Finalizado_Oficial, etc.

  @OneToMany(() => BoxScoreEntity, (bs) => bs.juego)
  boxscores!: BoxScoreEntity[];

  @CreateDateColumn()
  created_at!: Date;
}

// 6. BoxScore
@Entity('boxscores')
export class BoxScoreEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => JuegoSoftbolEntity, (juego) => juego.boxscores, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'juego_id' })
  juego!: JuegoSoftbolEntity;

  @Column({ type: 'uuid' })
  juego_id!: string;

  @Column({ type: 'int', default: 0 })
  carreras_local!: number;

  @Column({ type: 'int', default: 0 })
  carreras_visitante!: number;

  @Column({ type: 'int', default: 0 })
  hits_local!: number;

  @Column({ type: 'int', default: 0 })
  hits_visitante!: number;

  @Column({ type: 'int', default: 0 })
  errores_local!: number;

  @Column({ type: 'int', default: 0 })
  errores_visitante!: number;

  @CreateDateColumn()
  created_at!: Date;
}

// 7. EstadisticaBateo
@Entity('estadisticas_bateo')
export class EstadisticaBateoEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => JuegoSoftbolEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'juego_id' })
  juego!: JuegoSoftbolEntity;

  @Column({ type: 'uuid' })
  juego_id!: string;

  @ManyToOne(() => RosterJugadorEntity, (jugador) => jugador.estadisticas, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'jugador_id' })
  jugador!: RosterJugadorEntity;

  @Column({ type: 'uuid' })
  jugador_id!: string;

  @Column({ type: 'int', default: 0 })
  turnos_al_bate!: number;

  @Column({ type: 'int', default: 0 })
  hits!: number;

  @Column({ type: 'int', default: 0 })
  carreras_anotadas!: number;

  @Column({ type: 'int', default: 0 })
  carreras_impulsadas!: number;

  @Column({ type: 'int', default: 0 })
  homeruns!: number;

  @CreateDateColumn()
  created_at!: Date;
}
