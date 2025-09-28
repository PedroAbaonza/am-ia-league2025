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

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private readonly ADMIN_SESSION_KEY = 'am-ia-league-admin-session';
  private readonly CONFIG_KEY = 'am-ia-league-config';
  private readonly SQUADS_KEY = 'am-ia-league-squads-data';
  private readonly INDIVIDUALS_KEY = 'am-ia-league-individuals-data';
  
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
    dataSource: 'static'
  });

  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  public config$ = this.configSubject.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    // Inicializar después de la construcción para evitar problemas con SSR
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        this.initializeSession();
        this.configSubject.next(this.getConfig());
      }, 0);
      
      // Verificar sesión cada minuto
      setInterval(() => {
        this.validateSession();
      }, 60000);
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
        message: `Cuenta bloqueada. Intenta en ${remainingTime} minutos.` 
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
          message: 'Demasiados intentos fallidos. Cuenta bloqueada por 15 minutos.' 
        };
      }
      
      const remainingAttempts = this.MAX_LOGIN_ATTEMPTS - this.loginAttempts;
      return { 
        success: false, 
        message: `Contraseña incorrecta. ${remainingAttempts} intentos restantes.` 
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
      lastActivity: now
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
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convertir a 32-bit integer
    }
    return hash.toString();
  }

  private isLockedOut(): boolean {
    return Date.now() < this.lockoutUntil;
  }

  // Obtener información de sesión
  getSessionInfo(): { loginTime: Date; expiresAt: Date; timeRemaining: string } | null {
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
        timeRemaining: this.formatTimeRemaining(timeRemaining)
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
        dataSource: 'static'
      };
    }
    
    const saved = localStorage.getItem(this.CONFIG_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      isAdminMode: false,
      lastUpdate: '',
      dataSource: 'static'
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
      lastUpdate: new Date().toISOString()
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
      lastUpdate: new Date().toISOString()
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
    const lines = csvText.split('\n').filter(line => line.trim());
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const data = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
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

  // Convertir CSV a formato Squad
  convertToSquads(csvData: any[]): Squad[] {
    // Agrupar por squad
    const squadMap = new Map<string, any>();

    csvData.forEach(row => {
      const squadName = row.squadName || row['Squad Name'] || row.squad;
      if (!squadName) return;

      if (!squadMap.has(squadName)) {
        squadMap.set(squadName, {
          id: squadMap.size + 1,
          name: squadName,
          scrumMaster: row.scrumMaster || row['Scrum Master'] || '',
          developers: [],
          totalPoints: 0,
          color: this.getSquadColor(squadMap.size + 1)
        });
      }

      const squad = squadMap.get(squadName);
      const developerName = row.name || row.developer || row['Developer Name'];
      const points = parseInt(row.points || row.totalPoints || '0');

      if (developerName && !squad.developers.includes(developerName)) {
        squad.developers.push(developerName);
      }
      
      squad.totalPoints += points;
    });

    return Array.from(squadMap.values());
  }

  // Convertir CSV a formato Individual
  convertToIndividuals(csvData: any[]): Individual[] {
    return csvData.map((row, index) => ({
      id: index + 1,
      name: row.name || row['Developer Name'] || row.developer || '',
      squadId: this.getSquadIdByName(row.squadName || row['Squad Name'] || row.squad),
      squadName: row.squadName || row['Squad Name'] || row.squad || '',
      position: row.position || row.role || 'Developer',
      totalPoints: parseInt(row.points || row.totalPoints || '0'),
      completedMissions: parseInt(row.missions || row.completedMissions || '0'),
      specialChallenges: parseInt(row.challenges || row.specialChallenges || '0'),
      avatar: this.getInitials(row.name || row['Developer Name'] || row.developer || ''),
      level: row.level || this.getLevelByPoints(parseInt(row.points || '0'))
    }));
  }

  private getSquadColor(squadId: number): string {
    const colors = ['#00AEEF', '#FF2D82', '#00AEEF', '#FF2D82', '#00AEEF', '#FF2D82'];
    return colors[(squadId - 1) % colors.length];
  }

  private getSquadIdByName(squadName: string): number {
    // Mapeo simple basado en nombre
    const squadNames = ['Alpha Squadron', 'Beta Flight', 'Gamma Wings', 'Delta Force', 'Echo Team', 'Foxtrot Squad'];
    const index = squadNames.findIndex(name => name.toLowerCase().includes(squadName.toLowerCase()));
    return index >= 0 ? index + 1 : 1;
  }

  private getInitials(name: string): string {
    return name.split(' ')
      .map(word => word.charAt(0))
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
      lastUpdate: ''
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
      link.setAttribute('download', `squads-data-${new Date().toISOString().split('T')[0]}.csv`);
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
      const response = await fetch('/assets/templates/individuals-current-data.csv');
      const csvContent = await response.text();
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `individuals-data-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
    } catch (error) {
      throw new Error('No se pudo descargar el archivo de individuales');
    }
  }
}
