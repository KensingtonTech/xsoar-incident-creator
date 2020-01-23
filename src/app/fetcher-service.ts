import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject, Subscription } from 'rxjs';
import { HttpHeaders, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DemistoProperties } from './types/demisto-properties';
import { User } from './types/user';
import { ApiStatus } from './types/api-status';
import { DemistoIncidentField } from './types/demisto-incident-field';
import { FieldConfig, FieldsConfig } from './types/fields-config';

@Injectable()

export class FetcherService {

  constructor( private http: HttpClient ) {}



  demistoProperties: DemistoProperties; // gets set during test
  apiPath = '/api';
  currentUser: User;


  getLoggedInUser(): Promise<User> {
    let headers = new HttpHeaders( {
      Accept: 'application/json'
    } );
    return this.http.get(this.apiPath + '/whoami', { headers } )
                    .toPromise()
                    .then( (user: User) => {
                      this.currentUser = user;
                      return user;
                     } );
  }



  getApiStatus(): Promise<ApiStatus> {
    let headers = new HttpHeaders( {
      Accept: 'application/json'
    } );
    return this.http.get(this.apiPath + '/apiStatus', { headers } )
                    .toPromise()
                    .then( (status: ApiStatus) => status );
  }



  buildHeaders(authUser = null): HttpHeaders {
    let headers = new HttpHeaders(
      {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    );
    if (authUser) {
      headers = headers.set('Authorization', authUser);
    }
    return headers;
  }



  testDemisto( demistoProperties: DemistoProperties ): Promise<any> {
    this.demistoProperties = demistoProperties;
    let headers = this.buildHeaders();
    // headers = headers.append('Authorization', this.demistoProperties.apiKey);
    return this.http.post(this.apiPath + '/testConnect', demistoProperties, { headers } )
                    .toPromise();
  }



  createDemistoIncident( params: any ): Promise<any> {
    let headers = this.buildHeaders(this.currentUser.username);
    console.log('Current User: ', this.currentUser.username);
    return this.http.post(this.apiPath + '/createDemistoIncident', params, { headers } )
                    .toPromise();
  }



  getIncidentFields(): Promise<DemistoIncidentField[]> {
    let headers = this.buildHeaders();
    return this.http.get(this.apiPath + '/incidentfields', { headers } )
                    .toPromise()
                    .then( (res: any) => res.incident_fields );
  }



  getSampleIncident(): Promise<any> {
    let headers = this.buildHeaders();
    return this.http.get(this.apiPath + '/sampleincident', { headers } )
                    .toPromise();
  }



  getAllFieldConfigurations(): Promise<FieldsConfig> {
    let headers = this.buildHeaders();
    return this.http.get(this.apiPath + '/fieldConfig/all', { headers } )
                    .toPromise()
                    .then(value => value as FieldsConfig);
  }



  saveNewFieldConfiguration(config: FieldConfig): Promise<any> {
    let headers = this.buildHeaders();
    return this.http.post(this.apiPath + '/fieldConfig', config, { headers } )
                    .toPromise();
  }



  saveFieldConfiguration(config: FieldConfig): Promise<any> {
    let headers = this.buildHeaders();
    return this.http.post(this.apiPath + '/fieldConfig/update', config, { headers } )
                    .toPromise();
  }



  deleteFieldConfiguration(name: string): Promise<any> {
    let headers = this.buildHeaders();
    return this.http.delete(this.apiPath + `/fieldConfig/${name}`, { headers } )
                    .toPromise();
  }



  createInvestigation(id): Promise<boolean> {
    let headers = this.buildHeaders();
    return this.http.get(this.apiPath + '/createInvestigation/' + id, { headers } )
                    .toPromise()
                    .then( (value: any) => value.success);
  }

}
