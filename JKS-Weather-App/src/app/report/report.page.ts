import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebase.service'; // Adjust the path if necessary
import { Report } from '../model/report.model'; // Adjust the path if necessary

@Component({
  selector: 'app-report',
  templateUrl: './report.page.html',
  styleUrls: ['./report.page.scss'],
})
export class ReportPage implements OnInit {
  reports: Report[] = [];
  newReport: Report = { title: '', description: '' };
  selectedReport: Report | null = null;

  constructor(private firebaseService: FirebaseService) {}

  ngOnInit() {
    this.getReports();
  }

  getReports() {
    this.firebaseService.getItems().subscribe((data) => {
      this.reports = data;
    });
  }

  addReport() {
    this.firebaseService.addItem(this.newReport).then(() => {
      this.newReport = { title: '', description: '' }; // Reset form
      this.getReports(); // Refresh the list
    });
  }

  editReport(report: Report) {
    this.selectedReport = { ...report }; // Clone the selected report
  }

  updateReport() {
    if (this.selectedReport && this.selectedReport.id) {
      this.firebaseService.updateItem(this.selectedReport.id, this.selectedReport).then(() => {
        this.selectedReport = null; // Clear selection
        this.getReports(); // Refresh the list
      });
    }
  }

  deleteReport(report: Report) {
    if (report.id) {
      this.firebaseService.deleteItem(report.id).then(() => {
        this.getReports(); // Refresh the list
      });
    }
  }

  cancelEdit() {
    this.selectedReport = null; // Clear selection
  }
}
