import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { Squad, Individual } from './leaderboard.service';

export interface AdminConfig {
  isAdminMode: boolean;
  lastUpdate: string;
  dataSource: 'static' | 'uploaded';
}

export interface AdminSession {
  token: string;
  expiresAt: number;
  loginTime: number;
  lastActivity: number;
}

export interface SystemMetrics {
  totalUsers: number;
  totalSquads: number;
  averagePoints: number;
  topPerformer: string;
  lastActivity: string;
  systemHealth: 'excellent' | 'good' | 'warning' | 'critical';
  dataIntegrity: number;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  details: string;
  userSession: string;
  ipAddress?: string;
}

export interface DataIntegrityResult {
  integrity: number;
  issues: string[];
}

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private readonly ADMIN_SESSION_KEY = 'am-ia-league-admin-session';
  private readonly CONFIG_KEY = 'am-ia-league-config';
  private readonly SQUADS_KEY = 'am-ia-league-squads-data';
  private readonly INDIVIDUALS_KEY = 'am-ia-league-individuals-data';
  private readonly AUDIT_LOGS_KEY = 'am-ia-league-audit-logs';
  private readonly BACKUP_SQUADS_KEY = 'am-ia-league-backup-squads';
  private readonly BACKUP_INDIVIDUALS_KEY = 'am-ia-league-backup-individuals';

  // Configuración de seguridad
  private readonly SESSION_DURATION = 2 * 60 * 60 * 1000; // 2 horas
  private readonly INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutos
  private readonly MAX_LOGIN_ATTEMPTS = 3;
  private readonly LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutos

  private loginAttempts = 0;
  private lockoutUntil = 0;

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private configSubject = new BehaviorSubject<AdminConfig>({
    isAdminMode: false,
    lastUpdate: '',
    dataSource: 'static',
  });

  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  public config$ = this.configSubject.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    // Inicializar después de la construcción para evitar problemas con SSR
    if (isPlatformBrowser(this.platformId)) {
      // Usar requestAnimationFrame para asegurar que el DOM esté listo
      requestAnimationFrame(() => {
        this.initializeSession();
        this.configSubject.next(this.getConfig());

        // Verificar sesión cada minuto solo después de la inicialización
        setInterval(() => {
          this.validateSession();
        }, 60000);
      });
    }
  }

  // Autenticación mejorada con sesiones
  authenticate(password: string): { success: boolean; message: string } {
    if (!isPlatformBrowser(this.platformId)) {
      return { success: false, message: 'No disponible en servidor' };
    }

    // Verificar si está bloqueado
    if (this.isLockedOut()) {
      const remainingTime = Math.ceil((this.lockoutUntil - Date.now()) / 60000);
      return {
        success: false,
        message: `Cuenta bloqueada. Intenta en ${remainingTime} minutos.`,
      };
    }

    // Validar contraseña con hash simple
    const correctPasswordHash = this.hashPassword('aeromexico2025');
    const inputPasswordHash = this.hashPassword(password);

    if (inputPasswordHash === correctPasswordHash) {
      // Reset intentos y crear sesión
      this.loginAttempts = 0;
      this.lockoutUntil = 0;

      const session = this.createSession();
      localStorage.setItem(this.ADMIN_SESSION_KEY, JSON.stringify(session));
      this.isAuthenticatedSubject.next(true);

      return { success: true, message: 'Autenticación exitosa' };
    } else {
      // Incrementar intentos fallidos
      this.loginAttempts++;

      if (this.loginAttempts >= this.MAX_LOGIN_ATTEMPTS) {
        this.lockoutUntil = Date.now() + this.LOCKOUT_DURATION;
        return {
          success: false,
          message:
            'Demasiados intentos fallidos. Cuenta bloqueada por 15 minutos.',
        };
      }

      const remainingAttempts = this.MAX_LOGIN_ATTEMPTS - this.loginAttempts;
      return {
        success: false,
        message: `Contraseña incorrecta. ${remainingAttempts} intentos restantes.`,
      };
    }
  }

  logout(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    localStorage.removeItem(this.ADMIN_SESSION_KEY);
    this.isAuthenticatedSubject.next(false);
  }

  isAuthenticated(): boolean {
    return this.checkAuthStatus();
  }

  private initializeSession(): void {
    const isValid = this.validateSession();
    this.isAuthenticatedSubject.next(isValid);
  }

  private validateSession(): boolean {
    if (!isPlatformBrowser(this.platformId)) {
      return false;
    }

    const sessionData = localStorage.getItem(this.ADMIN_SESSION_KEY);
    if (!sessionData) {
      return false;
    }

    try {
      const session: AdminSession = JSON.parse(sessionData);
      const now = Date.now();

      // Verificar si la sesión ha expirado
      if (now > session.expiresAt) {
        this.logout();
        return false;
      }

      // Verificar inactividad
      if (now - session.lastActivity > this.INACTIVITY_TIMEOUT) {
        this.logout();
        return false;
      }

      // Actualizar última actividad
      session.lastActivity = now;
      localStorage.setItem(this.ADMIN_SESSION_KEY, JSON.stringify(session));

      return true;
    } catch (error) {
      this.logout();
      return false;
    }
  }

  private checkAuthStatus(): boolean {
    return this.validateSession();
  }

  private createSession(): AdminSession {
    const now = Date.now();
    return {
      token: this.generateToken(),
      expiresAt: now + this.SESSION_DURATION,
      loginTime: now,
      lastActivity: now,
    };
  }

  private generateToken(): string {
    // Generar token simple basado en timestamp y random
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2);
    return `${timestamp}-${random}`;
  }

  private hashPassword(password: string): string {
    // Hash simple para el navegador (NO usar en producción real)
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convertir a 32-bit integer
    }
    return hash.toString();
  }

  private isLockedOut(): boolean {
    return Date.now() < this.lockoutUntil;
  }

  // Obtener información de sesión
  getSessionInfo(): {
    loginTime: Date;
    expiresAt: Date;
    timeRemaining: string;
  } | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }

    const sessionData = localStorage.getItem(this.ADMIN_SESSION_KEY);
    if (!sessionData) {
      return null;
    }

    try {
      const session: AdminSession = JSON.parse(sessionData);
      const now = Date.now();
      const timeRemaining = session.expiresAt - now;

      return {
        loginTime: new Date(session.loginTime),
        expiresAt: new Date(session.expiresAt),
        timeRemaining: this.formatTimeRemaining(timeRemaining),
      };
    } catch (error) {
      return null;
    }
  }

  private formatTimeRemaining(milliseconds: number): string {
    if (milliseconds <= 0) return '0 minutos';

    const minutes = Math.floor(milliseconds / 60000);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      const remainingMinutes = minutes % 60;
      return `${hours}h ${remainingMinutes}m`;
    }

    return `${minutes} minutos`;
  }

  // Configuración
  private getConfig(): AdminConfig {
    if (!isPlatformBrowser(this.platformId)) {
      return {
        isAdminMode: false,
        lastUpdate: '',
        dataSource: 'static',
      };
    }

    const saved = localStorage.getItem(this.CONFIG_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      isAdminMode: false,
      lastUpdate: '',
      dataSource: 'static',
    };
  }

  updateConfig(config: Partial<AdminConfig>): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const currentConfig = this.getConfig();
    const newConfig = { ...currentConfig, ...config };
    localStorage.setItem(this.CONFIG_KEY, JSON.stringify(newConfig));
    this.configSubject.next(newConfig);
  }

  // Manejo de datos de Squads
  uploadSquadsData(squads: Squad[]): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    localStorage.setItem(this.SQUADS_KEY, JSON.stringify(squads));
    this.updateConfig({
      dataSource: 'uploaded',
      lastUpdate: new Date().toISOString(),
    });
  }

  getSquadsData(): Squad[] | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }

    const saved = localStorage.getItem(this.SQUADS_KEY);
    return saved ? JSON.parse(saved) : null;
  }

  // Manejo de datos de Individuales
  uploadIndividualsData(individuals: Individual[]): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    localStorage.setItem(this.INDIVIDUALS_KEY, JSON.stringify(individuals));
    this.updateConfig({
      dataSource: 'uploaded',
      lastUpdate: new Date().toISOString(),
    });
  }

  getIndividualsData(): Individual[] | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }

    const saved = localStorage.getItem(this.INDIVIDUALS_KEY);
    return saved ? JSON.parse(saved) : null;
  }

  // Parsear CSV
  parseCSV(csvText: string): any[] {
    const lines = csvText.split('\n').filter((line) => line.trim());
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map((h) => h.trim().replace(/"/g, ''));
    const data = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map((v) => v.trim().replace(/"/g, ''));
      if (values.length === headers.length) {
        const row: any = {};
        headers.forEach((header, index) => {
          row[header] = values[index];
        });
        data.push(row);
      }
    }

    return data;
  }

  // Convertir CSV a formato Squad (desde master file)
  convertToSquads(csvData: any[]): Squad[] {
    // Agrupar por squad
    const squadMap = new Map<string, any>();

    // Get existing squads to maintain consistent IDs and colors
    const existingSquads = this.getSquadsData() || [];
    const existingSquadMap = new Map(
      existingSquads.map((squad) => [squad.name, squad])
    );

    csvData.forEach((row) => {
      const squadName = row.squadName || row['Squad Name'] || row.squad;
      if (!squadName) return;

      if (!squadMap.has(squadName)) {
        // Check if squad already exists to maintain ID and color
        const existingSquad = existingSquadMap.get(squadName);

        squadMap.set(squadName, {
          id: existingSquad
            ? existingSquad.id
            : this.getNextSquadId(squadMap, existingSquads),
          name: squadName,
          scrumMaster: row.scrumMaster || row['Scrum Master'] || '',
          developers: [],
          totalPoints: 0,
          specialChallenges: parseInt(
            row.squadChallenges || row.challenges || '0'
          ),
          color: existingSquad
            ? existingSquad.color
            : this.getSquadColor(squadMap.size + 1),
        });
      }

      const squad = squadMap.get(squadName);
      const developerName = row.name || row.developer || row['Developer Name'];
      const points = parseInt(row.points || row.totalPoints || '0');

      // Update scrum master if provided and not already set
      if ((row.scrumMaster || row['Scrum Master']) && !squad.scrumMaster) {
        squad.scrumMaster = row.scrumMaster || row['Scrum Master'];
      }

      if (developerName && !squad.developers.includes(developerName)) {
        squad.developers.push(developerName);
      }

      squad.totalPoints += points;
      // squadChallenges is set once per squad, not summed per developer
    });

    // Sort squads by ID for consistent ordering
    return Array.from(squadMap.values()).sort((a, b) => a.id - b.id);
  }

  private getNextSquadId(
    squadMap: Map<string, any>,
    existingSquads: Squad[]
  ): number {
    const usedIds = new Set([
      ...existingSquads.map((squad) => squad.id),
      ...Array.from(squadMap.values()).map((squad) => squad.id),
    ]);

    let nextId = 1;
    while (usedIds.has(nextId)) {
      nextId++;
    }

    return nextId;
  }

  // Convertir CSV a formato Individual (desde master file)
  convertToIndividuals(csvData: any[]): Individual[] {
    return csvData.map((row, index) => ({
      id: index + 1,
      name: row.name || row['Developer Name'] || row.developer || '',
      squadId: this.getSquadIdByName(
        row.squadName || row['Squad Name'] || row.squad
      ),
      squadName: row.squadName || row['Squad Name'] || row.squad || '',
      position: row.position || row.role || 'Developer',
      totalPoints: parseInt(row.points || row.totalPoints || '0'),
      completedMissions: parseInt(row.missions || row.completedMissions || '0'),
      specialChallenges: 0, // Individual challenges not tracked, only squad challenges
      avatar: this.getInitials(
        row.name || row['Developer Name'] || row.developer || ''
      ),
      level: row.level || this.getLevelByPoints(parseInt(row.points || '0')),
    }));
  }

  private getSquadColor(squadId: number): string {
    const colors = [
      '#00AEEF', // Aviation Blue
      '#FF2D82', // Squadron Pink
      '#10b981', // Emerald Green
      '#f97316', // Orange
      '#8b5cf6', // Purple
      '#eab308', // Gold
      '#ef4444', // Red
      '#14b8a6', // Teal
      '#f59e0b', // Amber
      '#6366f1', // Indigo
      '#ec4899', // Pink
      '#06b6d4', // Cyan
      '#84cc16', // Lime
      '#f472b6', // Rose
      '#22d3ee', // Light Blue
      '#a78bfa', // Light Purple
      '#fbbf24', // Yellow
      '#fb7185', // Light Pink
      '#34d399', // Light Green
      '#60a5fa', // Sky Blue
    ];
    return colors[(squadId - 1) % colors.length];
  }

  private getSquadIdByName(squadName: string): number {
    // Get current squads data to maintain consistent IDs
    const existingSquads = this.getSquadsData() || [];

    // Check if squad already exists
    const existingSquad = existingSquads.find(
      (squad) => squad.name.toLowerCase() === squadName.toLowerCase()
    );

    if (existingSquad) {
      return existingSquad.id;
    }

    // For new squads, assign next available ID
    const maxId =
      existingSquads.length > 0
        ? Math.max(...existingSquads.map((squad) => squad.id))
        : 0;

    return maxId + 1;
  }

  private getInitials(name: string): string {
    return name
      .split(' ')
      .map((word) => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  private getLevelByPoints(points: number): string {
    if (points >= 500) return 'Expert';
    if (points >= 400) return 'Advanced';
    if (points >= 300) return 'Intermediate';
    return 'Beginner';
  }

  // Resetear a datos estáticos
  resetToStaticData(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    localStorage.removeItem(this.SQUADS_KEY);
    localStorage.removeItem(this.INDIVIDUALS_KEY);
    this.updateConfig({
      dataSource: 'static',
      lastUpdate: '',
    });
  }

  // Descargar datos actuales como CSV
  async downloadCurrentSquadsCSV(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    try {
      const response = await fetch('/assets/templates/squads-current-data.csv');
      const csvContent = await response.text();

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);

      link.setAttribute('href', url);
      link.setAttribute(
        'download',
        `squads-data-${new Date().toISOString().split('T')[0]}.csv`
      );
      link.style.visibility = 'hidden';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);
    } catch (error) {
      throw new Error('No se pudo descargar el archivo de squads');
    }
  }

  async downloadCurrentIndividualsCSV(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    try {
      const response = await fetch(
        '/assets/templates/individuals-current-data.csv'
      );
      const csvContent = await response.text();

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);

      link.setAttribute('href', url);
      link.setAttribute(
        'download',
        `individuals-data-${new Date().toISOString().split('T')[0]}.csv`
      );
      link.style.visibility = 'hidden';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);
    } catch (error) {
      throw new Error('No se pudo descargar el archivo de individuales');
    }
  }

  // Nuevos métodos profesionales

  // Sistema de métricas
  getSystemMetrics(): SystemMetrics {
    if (!isPlatformBrowser(this.platformId)) {
      return {
        totalUsers: 0,
        totalSquads: 0,
        averagePoints: 0,
        topPerformer: '',
        lastActivity: '',
        systemHealth: 'good',
        dataIntegrity: 100,
      };
    }

    const squads = this.getSquadsData() || [];
    const individuals = this.getIndividualsData() || [];

    const totalUsers = individuals.length;
    const totalSquads = squads.length;
    const totalPoints = individuals.reduce(
      (sum, ind) => sum + ind.totalPoints,
      0
    );
    const averagePoints =
      totalUsers > 0 ? Math.round(totalPoints / totalUsers) : 0;

    const topPerformer =
      individuals.length > 0
        ? individuals.reduce((top, current) =>
            current.totalPoints > top.totalPoints ? current : top
          ).name
        : '';

    const config = this.getConfig();
    const lastActivity = config.lastUpdate || new Date().toISOString();

    // Calcular salud del sistema
    let systemHealth: 'excellent' | 'good' | 'warning' | 'critical' = 'good';
    if (totalUsers > 50 && averagePoints > 400) systemHealth = 'excellent';
    else if (totalUsers < 10 || averagePoints < 200) systemHealth = 'warning';
    else if (totalUsers === 0) systemHealth = 'critical';

    return {
      totalUsers,
      totalSquads,
      averagePoints,
      topPerformer,
      lastActivity,
      systemHealth,
      dataIntegrity: this.calculateDataIntegrity(),
    };
  }

  private calculateDataIntegrity(): number {
    try {
      const squads = this.getSquadsData() || [];
      const individuals = this.getIndividualsData() || [];

      let integrity = 100;

      // Verificar consistencia de datos
      individuals.forEach((individual) => {
        const squadExists = squads.some(
          (squad) => squad.name === individual.squadName
        );
        if (!squadExists) integrity -= 5;

        if (!individual.name || individual.totalPoints < 0) integrity -= 2;
      });

      squads.forEach((squad) => {
        if (!squad.name || squad.totalPoints < 0) integrity -= 3;
        if (squad.developers.length === 0) integrity -= 2;
      });

      return Math.max(0, integrity);
    } catch (error) {
      return 0;
    }
  }

  // Sistema de auditoría
  logAction(action: string, details: string): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const session = this.getCurrentSession();
    const log: AuditLog = {
      id: this.generateId(),
      timestamp: new Date().toISOString(),
      action,
      details,
      userSession: session?.token || 'unknown',
      ipAddress: 'localhost', // En producción, obtener IP real
    };

    const logs = this.getAuditLogs();
    logs.unshift(log);

    // Mantener solo los últimos 100 logs
    const trimmedLogs = logs.slice(0, 100);
    localStorage.setItem(this.AUDIT_LOGS_KEY, JSON.stringify(trimmedLogs));
  }

  getAuditLogs(): AuditLog[] {
    if (!isPlatformBrowser(this.platformId)) {
      return [];
    }

    const saved = localStorage.getItem(this.AUDIT_LOGS_KEY);
    return saved ? JSON.parse(saved) : [];
  }

  clearAuditLogs(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    localStorage.removeItem(this.AUDIT_LOGS_KEY);
    this.logAction('clear_logs', 'Logs de auditoría limpiados');
  }

  exportAuditLogs(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const logs = this.getAuditLogs();
    const csvContent = this.convertLogsToCSV(logs);

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `audit-logs-${new Date().toISOString().split('T')[0]}.csv`
    );
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);

    this.logAction('export_logs', 'Logs de auditoría exportados');
  }

  private convertLogsToCSV(logs: AuditLog[]): string {
    const headers = [
      'ID',
      'Timestamp',
      'Action',
      'Details',
      'User Session',
      'IP Address',
    ];
    const rows = logs.map((log) => [
      log.id,
      log.timestamp,
      log.action,
      log.details,
      log.userSession,
      log.ipAddress || '',
    ]);

    return [headers, ...rows]
      .map((row) => row.map((field) => `"${field}"`).join(','))
      .join('\n');
  }

  // Sistema de backup
  createBackup(type: 'squads' | 'individuals'): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const key = type === 'squads' ? this.SQUADS_KEY : this.INDIVIDUALS_KEY;
    const backupKey =
      type === 'squads' ? this.BACKUP_SQUADS_KEY : this.BACKUP_INDIVIDUALS_KEY;

    const currentData = localStorage.getItem(key);
    if (currentData) {
      const backup = {
        data: currentData,
        timestamp: new Date().toISOString(),
      };
      localStorage.setItem(backupKey, JSON.stringify(backup));
      this.logAction('create_backup', `Backup creado para ${type}`);
    }
  }

  restoreFromBackup(type: 'squads' | 'individuals'): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const backupKey =
      type === 'squads' ? this.BACKUP_SQUADS_KEY : this.BACKUP_INDIVIDUALS_KEY;
    const key = type === 'squads' ? this.SQUADS_KEY : this.INDIVIDUALS_KEY;

    const backupData = localStorage.getItem(backupKey);
    if (backupData) {
      const backup = JSON.parse(backupData);
      localStorage.setItem(key, backup.data);

      this.updateConfig({
        dataSource: 'uploaded',
        lastUpdate: new Date().toISOString(),
      });

      this.logAction(
        'restore_backup',
        `Datos de ${type} restaurados desde backup del ${backup.timestamp}`
      );
    } else {
      throw new Error('No hay backup disponible');
    }
  }

  // Validación de integridad
  validateDataIntegrity(): DataIntegrityResult {
    const issues: string[] = [];
    let integrity = 100;

    try {
      const squads = this.getSquadsData() || [];
      const individuals = this.getIndividualsData() || [];

      // Validar squads
      squads.forEach((squad, index) => {
        if (!squad.name) {
          issues.push(`Squad ${index + 1}: Nombre faltante`);
          integrity -= 5;
        }
        if (squad.totalPoints < 0) {
          issues.push(`Squad ${squad.name}: Puntos negativos`);
          integrity -= 3;
        }
        if (!squad.developers || squad.developers.length === 0) {
          issues.push(`Squad ${squad.name}: Sin desarrolladores`);
          integrity -= 2;
        }
      });

      // Validar individuales
      individuals.forEach((individual, index) => {
        if (!individual.name) {
          issues.push(`Individual ${index + 1}: Nombre faltante`);
          integrity -= 5;
        }
        if (individual.totalPoints < 0) {
          issues.push(`Individual ${individual.name}: Puntos negativos`);
          integrity -= 3;
        }
        if (!individual.squadName) {
          issues.push(`Individual ${individual.name}: Squad no asignado`);
          integrity -= 2;
        } else {
          const squadExists = squads.some(
            (squad) => squad.name === individual.squadName
          );
          if (!squadExists) {
            issues.push(
              `Individual ${individual.name}: Squad inexistente (${individual.squadName})`
            );
            integrity -= 4;
          }
        }
      });

      // Validar consistencia de puntos
      squads.forEach((squad) => {
        const squadMembers = individuals.filter(
          (ind) => ind.squadName === squad.name
        );
        const calculatedPoints = squadMembers.reduce(
          (sum, member) => sum + member.totalPoints,
          0
        );

        if (Math.abs(squad.totalPoints - calculatedPoints) > 10) {
          issues.push(`Squad ${squad.name}: Inconsistencia en puntos totales`);
          integrity -= 3;
        }
      });

      this.logAction(
        'validate_integrity',
        `Integridad validada: ${Math.max(0, integrity)}%`
      );

      return {
        integrity: Math.max(0, integrity),
        issues,
      };
    } catch (error) {
      return {
        integrity: 0,
        issues: ['Error crítico en validación de datos'],
      };
    }
  }

  private getCurrentSession(): AdminSession | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }

    const sessionData = localStorage.getItem(this.ADMIN_SESSION_KEY);
    return sessionData ? JSON.parse(sessionData) : null;
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }
}
