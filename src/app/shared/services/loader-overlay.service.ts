import { Injectable, TemplateRef, ViewContainerRef, Injector, ComponentRef } from '@angular/core';
import { Overlay, OverlayRef, PositionStrategy, OverlayConfig } from '@angular/cdk/overlay';
import { TemplatePortal, ComponentPortal, PortalInjector } from '@angular/cdk/portal';
import { PageLoaderComponent } from '../components/page-loader/page-loader.component';
export class LoadingOverlayRef {
  constructor(private overlayRef: OverlayRef) { }
  close(): void {
    this.overlayRef.dispose();
  }
}
@Injectable({
  providedIn: 'root'
})
export class LoaderOverlayService {
  private readonly minDisplayTime = 1500;
  private loadingRef: LoadingOverlayRef | null = null;
   constructor(private injector: Injector, private overlay: Overlay) {
  }
  open(): LoadingOverlayRef {
    const overlayRef = this.createOverlay();
    const dialogRef = new LoadingOverlayRef(overlayRef);
    const overlayComponent = this.attachDialogContainer(overlayRef, dialogRef);
    return dialogRef;
  }
  private createOverlay(): OverlayRef {
    const positionStrategy = this.overlay
      .position()
      .global()
      .centerHorizontally()
      .centerVertically();
    const overlayConfig = new OverlayConfig({
      hasBackdrop: true,
      scrollStrategy: this.overlay.scrollStrategies.block(),
      positionStrategy,
      // backdropClass:'loader-backdrop'
    });
    return this.overlay.create(overlayConfig);
  }
  private attachDialogContainer(overlayRef: OverlayRef, dialogRef: LoadingOverlayRef): PageLoaderComponent {
    const injector = this.createInjector(dialogRef);
    const containerPortal = new ComponentPortal(PageLoaderComponent, null, injector);
    const containerRef: ComponentRef<PageLoaderComponent> = overlayRef.attach(containerPortal);
    return containerRef.instance;
  }
  private createInjector(dialogRef: LoadingOverlayRef): PortalInjector {
    const injectionTokens = new WeakMap();
    injectionTokens.set(LoadingOverlayRef, dialogRef);
    return new PortalInjector(this.injector, injectionTokens);
  }
  showLoader() {
    Promise.resolve(null).then(() => this.loadingRef = this.open());
  }
  hideLoader() {
    if (this.minDisplayTime > 0) {
      setTimeout(() => this.closeLoader(), this.minDisplayTime);
    } else {
      this.closeLoader();
    }
  }
  private closeLoader() {
    if (this.loadingRef) {
      this.loadingRef.close();
      this.loadingRef = null;
    }
  }
  showShimmerBtn() {
    return true;
  }
  hideShimmerBtn() {
    return false;
  }
}
