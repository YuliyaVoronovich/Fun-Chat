export function isNotNullable<T>(value: T): value is NonNullable<T> {
  return value != null;
}

export type Props<T extends HTMLElement = HTMLElement> = Partial<
  Omit<T, 'style' | 'dataset' | 'classList' | 'children' | 'tagName'>
> & {
  txt?: string;
  tag?: keyof HTMLElementTagNameMap;
};

export type PossibleChild = HTMLElement | BaseComponent | null;

export class BaseComponent<T extends HTMLElement = HTMLElement> {
  protected node: T;

  protected children: BaseComponent[] = [];

  constructor(props: Props<T>, ...children: PossibleChild[]) {
    const node = document.createElement(props.tag ?? 'div') as T;
    Object.assign(node, props);
    this.node = node;
    if (props.txt) {
      this.node.textContent = props.txt;
    }
    if (children.length > 0) {
      this.appendChildren(children.filter(isNotNullable));
    }
  }

  public append(child: NonNullable<PossibleChild>): void {
    if (child instanceof BaseComponent) {
      this.children.push(child);
      this.node.append(child.getNode());
    } else {
      this.node.append(child);
    }
  }

  public appendChildren(children: PossibleChild[]): void {
    children.filter(isNotNullable).forEach((child) => {
      this.append(child);
    });
  }

  public after(child: BaseComponent): void {
    this.node.after(child.getNode());
  }

  public before(child: BaseComponent): void {
    this.node.before(child.getNode());
  }

  public prepend(child: BaseComponent): void {
    if (child instanceof BaseComponent) {
      this.children.push(child);
      this.node.prepend(child.getNode());
    } else {
      this.node.prepend(child);
    }
  }

  public getNode(): HTMLElement {
    return this.node;
  }

  public getChildren(): BaseComponent[] {
    return this.children;
  }

  public setAttribute(attribute: string, value: string): void {
    this.node.setAttribute(attribute, value);
  }

  public setTextContent(content: string): void {
    this.node.textContent = content;
  }

  public setHTML(html: string): void {
    this.node.innerHTML = html;
  }

  public getAttribute(attribute: string): string | null {
    return this.node.getAttribute(attribute);
  }

  public removeAttribute(attribute: string): void {
    this.node.removeAttribute(attribute);
  }

  public addClass(className: string): void {
    this.node.classList.add(className);
  }

  public removeClass(className: string): void {
    this.node.classList.remove(className);
  }

  public toggleClass(className: string, force?: boolean): void {
    this.node.classList.toggle(className, force);
  }

  public setStyle(property: string, value: string): void {
    this.node.attributeStyleMap.set(property, value);
  }

  public deleteStyle(property: string): void {
    this.node.attributeStyleMap.delete(property);
  }

  public setScrollTop(): void {
    this.node.scrollTop = this.node.scrollHeight;
  }

  public getNodeProperty(property: keyof HTMLElement) {
    return this.node[property];
  }

  public addListener(
    event: string,
    listener: (e: Event) => void,
    options: AddEventListenerOptions | boolean = false,
  ): void {
    this.node.addEventListener(event, listener, options);
  }

  public removeListener(
    event: string,
    listener: (e: Event) => void,
    options: AddEventListenerOptions | boolean = false,
  ): void {
    this.node.removeEventListener(event, listener, options);
  }

  public destroyChildren(): void {
    this.children.forEach((child) => {
      child.destroy();
    });
    this.children.length = 0;
  }

  public destroy(): void {
    this.destroyChildren();
    this.node.remove();
  }

  public removeChild(child: BaseComponent): void {
    this.children = this.children.filter((item) => item !== child);
  }

  public replaceChild(child: BaseComponent): void {
    this.destroyChildren();
    this.append(child);
  }
}
