import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService, AdminConfig } from '../../services/admin.service';

@Component({
  selector: 'app-admin',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent implements OnInit {
  isAuthenticated = false;
  password = '';
  loginError = '';
  
  config: AdminConfig = {
    isAdminMode: false,
    lastUpdate: '',
    dataSource: 'static'
  };

  squadFileName = '';
  individualFileName = '';
  squadFileContent = '';
  individualFileContent = '';
  
  successMessage = '';
  errorMessage = '';

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.adminService.isAuthenticated$.subscribe(auth => {
      this.isAuthenticated = auth;
    });

    this.adminService.config$.subscribe(config => {
      this.config = config;
    });
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
      this.squadFileName = file.name;
      this.readFile(file, (content) => {
        this.squadFileContent = content;
      });
    }
  }

  onIndividualFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.individualFileName = file.name;
      this.readFile(file, (content) => {
        this.individualFileContent = content;
      });
    }
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

      this.adminService.uploadSquadsData(squads);
      this.showSuccess(`Datos de ${squads.length} squads procesados correctamente`);
      this.squadFileName = '';
      this.squadFileContent = '';
    } catch (error) {
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

      this.adminService.uploadIndividualsData(individuals);
      this.showSuccess(`Datos de ${individuals.length} desarrolladores procesados correctamente`);
      this.individualFileName = '';
      this.individualFileContent = '';
    } catch (error) {
      this.showError('Error procesando el archivo: ' + error);
    }
  }

  resetToStatic() {
    if (confirm('¿Estás seguro de que quieres volver a los datos estáticos? Se perderán los datos subidos.')) {
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
    this.adminService.downloadCurrentSquadsCSV()
      .then(() => {
        this.showSuccess('Archivo de squads descargado correctamente');
      })
      .catch(error => {
        this.showError('Error descargando archivo: ' + error);
      });
  }

  downloadCurrentIndividualsData() {
    // Generar CSV con datos actuales individuales
    this.adminService.downloadCurrentIndividualsCSV()
      .then(() => {
        this.showSuccess('Archivo de individuales descargado correctamente');
      })
      .catch(error => {
        this.showError('Error descargando archivo: ' + error);
      });
  }

  refreshData() {
    // Forzar actualización de la vista
    window.location.reload();
  }
}
