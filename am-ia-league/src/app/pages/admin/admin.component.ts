import {
  Component,
  OnInit,
  OnDestroy,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  AdminService,
  AdminConfig,
  SystemMetrics,
  AuditLog,
} from '../../services/admin.service';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-admin',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
})
export class AdminComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  password = '';
  loginError = '';

  config: AdminConfig = {
    isAdminMode: false,
    lastUpdate: '',
    dataSource: 'static',
  };

  squadFileName = '';
  individualFileName = '';
  squadFileContent = '';
  individualFileContent = '';

  successMessage = '';
  errorMessage = '';

  // Nuevas propiedades para métricas y logs
  systemMetrics: SystemMetrics = {
    totalUsers: 0,
    totalSquads: 0,
    averagePoints: 0,
    topPerformer: '',
    lastActivity: '',
    systemHealth: 'good',
    dataIntegrity: 100,
  };

  auditLogs: AuditLog[] = [];
  isLoadingMetrics = false;
  showAdvancedOptions = false;

  // Control de visibilidad de squads
  showSquadsDetails = false;
  showIndividualsDetails = false;

  // Validación de archivos
  fileValidationErrors: string[] = [];
  isValidatingFile = false;

  private metricsSubscription?: Subscription;
  private sessionCheckSubscription?: Subscription;

  constructor(
    private adminService: AdminService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    // Solo inicializar en el navegador para evitar problemas con SSR
    if (isPlatformBrowser(this.platformId)) {
      this.adminService.isAuthenticated$.subscribe((auth) => {
        this.isAuthenticated = auth;
        if (auth) {
          this.initializeDashboard();
        }
      });

      this.adminService.config$.subscribe((config) => {
        this.config = config;
      });

      // Verificar sesión cada 30 segundos
      this.sessionCheckSubscription = interval(30000).subscribe(() => {
        if (this.isAuthenticated) {
          this.checkSessionStatus();
        }
      });
    }
  }

  ngOnDestroy() {
    this.metricsSubscription?.unsubscribe();
    this.sessionCheckSubscription?.unsubscribe();
  }

  private initializeDashboard() {
    this.loadSystemMetrics();
    this.loadAuditLogs();

    // Actualizar métricas cada 2 minutos solo en el navegador
    if (isPlatformBrowser(this.platformId)) {
      this.metricsSubscription = interval(120000).subscribe(() => {
        this.loadSystemMetrics();
      });
    }
  }

  private loadSystemMetrics() {
    this.isLoadingMetrics = true;
    this.systemMetrics = this.adminService.getSystemMetrics();
    this.isLoadingMetrics = false;
  }

  private loadAuditLogs() {
    this.auditLogs = this.adminService.getAuditLogs();
  }

  private checkSessionStatus() {
    const sessionInfo = this.adminService.getSessionInfo();
    if (!sessionInfo) {
      this.showError('Sesión expirada. Por favor, inicia sesión nuevamente.');
      this.logout();
    }
  }

  login() {
    this.loginError = '';
    const result = this.adminService.authenticate(this.password);

    if (result.success) {
      this.password = '';
      this.showSuccess('Sesión iniciada correctamente');
    } else {
      this.loginError = result.message;
    }
  }

  logout() {
    this.adminService.logout();
    this.showSuccess('Sesión cerrada correctamente');
  }

  getSessionInfo() {
    return this.adminService.getSessionInfo();
  }

  onSquadFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.validateFile(file, 'squad').then((isValid) => {
        if (isValid) {
          this.squadFileName = file.name;
          this.readFile(file, (content) => {
            this.squadFileContent = content;
            this.validateCSVContent(content, 'squad');
          });
        }
      });
    }
  }

  onIndividualFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.validateFile(file, 'individual').then((isValid) => {
        if (isValid) {
          this.individualFileName = file.name;
          this.readFile(file, (content) => {
            this.individualFileContent = content;
            this.validateCSVContent(content, 'individual');
          });
        }
      });
    }
  }

  private async validateFile(
    file: File,
    type: 'squad' | 'individual'
  ): Promise<boolean> {
    this.fileValidationErrors = [];
    this.isValidatingFile = true;

    try {
      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.fileValidationErrors.push(
          'El archivo es demasiado grande (máximo 5MB)'
        );
      }

      // Validar tipo
      const allowedTypes = ['.csv', '.txt'];
      const fileExtension = file.name
        .toLowerCase()
        .substring(file.name.lastIndexOf('.'));
      if (!allowedTypes.includes(fileExtension)) {
        this.fileValidationErrors.push(
          'Tipo de archivo no válido. Solo se permiten archivos CSV'
        );
      }

      // Validar contenido básico
      const content = await this.readFileAsync(file);
      if (!content || content.trim().length === 0) {
        this.fileValidationErrors.push('El archivo está vacío');
      }

      this.isValidatingFile = false;

      if (this.fileValidationErrors.length > 0) {
        this.showError(
          `Errores de validación: ${this.fileValidationErrors.join(', ')}`
        );
        return false;
      }

      return true;
    } catch (error) {
      this.isValidatingFile = false;
      this.showError('Error validando el archivo: ' + error);
      return false;
    }
  }

  private validateCSVContent(content: string, type: 'squad' | 'individual') {
    try {
      const csvData = this.adminService.parseCSV(content);
      const requiredFields =
        type === 'squad'
          ? ['squadName', 'name', 'points']
          : ['name', 'squadName', 'points'];

      if (csvData.length === 0) {
        this.showError('El archivo CSV no contiene datos válidos');
        return;
      }

      const firstRow = csvData[0];
      const missingFields = requiredFields.filter(
        (field) => !(field in firstRow)
      );

      if (missingFields.length > 0) {
        this.showError(
          `Campos requeridos faltantes: ${missingFields.join(', ')}`
        );
        return;
      }

      this.showSuccess(
        `Archivo validado correctamente. ${csvData.length} registros encontrados.`
      );
    } catch (error) {
      this.showError('Error validando contenido CSV: ' + error);
    }
  }

  private readFileAsync(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = (e) => reject(e);
      reader.readAsText(file);
    });
  }

  processSquadFile() {
    if (!this.squadFileContent) {
      this.showError('No hay archivo seleccionado');
      return;
    }

    try {
      const csvData = this.adminService.parseCSV(this.squadFileContent);
      const squads = this.adminService.convertToSquads(csvData);

      if (squads.length === 0) {
        this.showError('No se pudieron procesar los datos del archivo');
        return;
      }

      // Crear backup antes de procesar
      this.adminService.createBackup('squads');

      this.adminService.uploadSquadsData(squads);
      this.adminService.logAction(
        'upload_squads',
        `${squads.length} squads procesados desde ${this.squadFileName}`
      );

      this.showSuccess(
        `Datos de ${squads.length} squads procesados correctamente`
      );
      this.squadFileName = '';
      this.squadFileContent = '';

      // Actualizar métricas
      this.loadSystemMetrics();
      this.loadAuditLogs();
    } catch (error) {
      this.adminService.logAction(
        'upload_error',
        `Error procesando squads: ${error}`
      );
      this.showError('Error procesando el archivo: ' + error);
    }
  }

  processIndividualFile() {
    if (!this.individualFileContent) {
      this.showError('No hay archivo seleccionado');
      return;
    }

    try {
      const csvData = this.adminService.parseCSV(this.individualFileContent);
      const individuals = this.adminService.convertToIndividuals(csvData);

      if (individuals.length === 0) {
        this.showError('No se pudieron procesar los datos del archivo');
        return;
      }

      // Crear backup antes de procesar
      this.adminService.createBackup('individuals');

      this.adminService.uploadIndividualsData(individuals);
      this.adminService.logAction(
        'upload_individuals',
        `${individuals.length} desarrolladores procesados desde ${this.individualFileName}`
      );

      this.showSuccess(
        `Datos de ${individuals.length} desarrolladores procesados correctamente`
      );
      this.individualFileName = '';
      this.individualFileContent = '';

      // Actualizar métricas
      this.loadSystemMetrics();
      this.loadAuditLogs();
    } catch (error) {
      this.adminService.logAction(
        'upload_error',
        `Error procesando individuales: ${error}`
      );
      this.showError('Error procesando el archivo: ' + error);
    }
  }

  resetToStatic() {
    if (
      confirm(
        '¿Estás seguro de que quieres volver a los datos estáticos? Se perderán los datos subidos.'
      )
    ) {
      this.adminService.resetToStaticData();
      this.showSuccess('Datos restablecidos a la versión estática');
    }
  }

  private readFile(file: File, callback: (content: string) => void) {
    const reader = new FileReader();
    reader.onload = (e) => {
      callback(e.target?.result as string);
    };
    reader.readAsText(file);
  }

  private showSuccess(message: string) {
    this.successMessage = message;
    this.errorMessage = '';
    setTimeout(() => {
      this.successMessage = '';
    }, 5000);
  }

  private showError(message: string) {
    this.errorMessage = message;
    this.successMessage = '';
    setTimeout(() => {
      this.errorMessage = '';
    }, 5000);
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('es-ES');
  }

  getSquadsCount(): number {
    const data = this.adminService.getSquadsData();
    return data ? data.length : 0;
  }

  getIndividualsCount(): number {
    const data = this.adminService.getIndividualsData();
    return data ? data.length : 0;
  }

  downloadCurrentSquadsData() {
    // Generar CSV con datos actuales de squads
    this.adminService
      .downloadCurrentSquadsCSV()
      .then(() => {
        this.showSuccess('Archivo de squads descargado correctamente');
      })
      .catch((error) => {
        this.showError('Error descargando archivo: ' + error);
      });
  }

  downloadCurrentIndividualsData() {
    // Generar CSV con datos actuales individuales
    this.adminService
      .downloadCurrentIndividualsCSV()
      .then(() => {
        this.showSuccess('Archivo de individuales descargado correctamente');
      })
      .catch((error) => {
        this.showError('Error descargando archivo: ' + error);
      });
  }

  refreshData() {
    this.loadSystemMetrics();
    this.loadAuditLogs();
    this.showSuccess('Datos actualizados correctamente');
  }

  // Nuevos métodos profesionales
  toggleAdvancedOptions() {
    this.showAdvancedOptions = !this.showAdvancedOptions;
  }

  exportAuditLogs() {
    try {
      this.adminService.exportAuditLogs();
      this.showSuccess('Logs de auditoría exportados correctamente');
    } catch (error) {
      this.showError('Error exportando logs: ' + error);
    }
  }

  clearAuditLogs() {
    if (
      confirm(
        '¿Estás seguro de que quieres limpiar todos los logs de auditoría?'
      )
    ) {
      this.adminService.clearAuditLogs();
      this.loadAuditLogs();
      this.showSuccess('Logs de auditoría limpiados');
    }
  }

  restoreFromBackup(type: 'squads' | 'individuals') {
    if (
      confirm(
        `¿Estás seguro de que quieres restaurar los datos de ${type} desde el backup?`
      )
    ) {
      try {
        this.adminService.restoreFromBackup(type);
        this.loadSystemMetrics();
        this.showSuccess(`Datos de ${type} restaurados desde backup`);
      } catch (error) {
        this.showError('Error restaurando backup: ' + error);
      }
    }
  }

  validateDataIntegrity() {
    this.isLoadingMetrics = true;
    try {
      const result = this.adminService.validateDataIntegrity();
      this.systemMetrics.dataIntegrity = result.integrity;

      if (result.issues.length > 0) {
        this.showError(
          `Problemas de integridad encontrados: ${result.issues.join(', ')}`
        );
      } else {
        this.showSuccess('Integridad de datos validada correctamente');
      }
    } catch (error) {
      this.showError('Error validando integridad: ' + error);
    } finally {
      this.isLoadingMetrics = false;
    }
  }

  getSystemHealthColor(): string {
    switch (this.systemMetrics.systemHealth) {
      case 'excellent':
        return '#10b981';
      case 'good':
        return '#00AEEF';
      case 'warning':
        return '#f59e0b';
      case 'critical':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  }

  getDataIntegrityColor(): string {
    if (this.systemMetrics.dataIntegrity >= 95) return '#10b981';
    if (this.systemMetrics.dataIntegrity >= 80) return '#f59e0b';
    return '#ef4444';
  }

  formatLogDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  // Métodos para controlar visibilidad de datos
  toggleSquadsDetails() {
    this.showSquadsDetails = !this.showSquadsDetails;
    if (this.showSquadsDetails) {
      this.adminService.logAction(
        'view_squads',
        'Detalles de squads visualizados'
      );
    }
  }

  toggleIndividualsDetails() {
    this.showIndividualsDetails = !this.showIndividualsDetails;
    if (this.showIndividualsDetails) {
      this.adminService.logAction(
        'view_individuals',
        'Detalles de individuales visualizados'
      );
    }
  }

  // Obtener datos para mostrar
  getCurrentSquads() {
    return this.adminService.getSquadsData() || [];
  }

  getCurrentIndividuals() {
    return this.adminService.getIndividualsData() || [];
  }

  // Obtener desarrolladores por squad
  getDevelopersBySquad(squadName: string) {
    const individuals = this.getCurrentIndividuals();
    return individuals.filter((ind) => ind.squadName === squadName);
  }

  // Formatear puntos con separadores de miles
  formatPoints(points: number): string {
    return points.toLocaleString('es-ES');
  }
}
