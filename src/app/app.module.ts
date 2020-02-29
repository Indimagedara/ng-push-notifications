import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule, SwPush, SwUpdate } from '@angular/service-worker';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    MatSnackBarModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(update: SwUpdate, push: SwPush, snackbar: MatSnackBar){
    update.available.subscribe(update=>{
      console.log('update available');
      // Allow user to refresh from the snackbar
      const snack = snackbar.open('Update available','Reload');

      snack.onAction().subscribe(()=>{
        window.location.reload();
      })

    });

    push.messages.subscribe(msg=>{
      console.log(msg);
      snackbar.open(JSON.stringify(msg));
    });

    const key = 'BMke-4D5rLWToAPsCdpn61bMb97Y3PkxaLt0hJ-TBygcnPNFOwbEeeb-ImNl_3oaKSO0iufQerztYs2gElxSCxs';
    push.requestSubscription({serverPublicKey: key}).then(
      PushSubscription =>{
        console.log(PushSubscription.toJSON());
      }
    )
  }
 }

//  Refer this : https://github.com/web-push-libs/web-push
//  Sample webpush command :   web-push send-notification --endpoint="https://fcm.googleapis.com/fcm/send/cVFE0gGaDN4:APA91bGnuNBiTteltDWqNTUnPiOjjTrYJm9p6ZqHF8O8BTPcjbI3mJnR_Wf5_N8LorOjT_b7tpKMnlAaFQbL1d2vQlBim8rBZEhXzsQCzFJhi5s_ed-OMKKMD3gJf2I4S83OgB5PXckL" --key="BJfwEsYzLVgMW2tvOhnIZyCJk2YtpNa1Jmks2QepqNf0vz77gSzrHtpaFhDTy31-DgdaNvxNqghyJdMZnF-8Rh0" --auth="dBTOvLHRSmQdodcuFm8Vnw" --payload='{"test":"hello world","notification":{"title":"test title","body":"test body"}}' --vapid-subject="https://localhost:8000" --vapid-pubkey=BMke-4D5rLWToAPsCdpn61bMb97Y3PkxaLt0hJ-TBygcnPNFOwbEeeb-ImNl_3oaKSO0iufQerztYs2gElxSCxs --vapid-pvtkey=I9MP_ERnOX_yo67R238lcJ_CUA1wH4GfosTMK7bfmng