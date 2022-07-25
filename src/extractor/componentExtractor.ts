export const extractComponents = (pages: PageNode[]) => {
  const customFilter = '_custom'
  // NOTE: the COMPONENT node itself will be the 'container' and thus will have style properties on it.
  const componentTypes = [
    {
      // CHECK FOR FLEXIBLE WIDTH
      type: 'COMPONENT',
      properties: [
        'height', // number
        'width', // number
        'bottomLeftRadius', // number
        'bottomRightRadius', // number
        'topLeftRadius', // number
        'topRightRadius', // number
        'cornerRadius', // number (combination of the 4 values for each corner, if same)
        'backgrounds', // {type: string, visible: boolean, opacity: number, blendMode: string, color: {b: number, g: number, r: number}}
        'fills', // {type: string, visible: boolean, opacity: number, blendMode: string, color: {b: number, g: number, r: number}}
        'name', // string (name of the element in Figma, aka 'component/button')
        'description', // string
        'opacity', // number
        'rotation', // number
        'paddingTop', // number
        'paddingRight', // number
        'paddingBottom', // number
        'paddingLeft', // number
        'itemSpacing', // number (spacing between elements inside the container, aka gap)
        'layoutMode', // string ('HORIZONTAL' or 'VERTICAL', similar to flex-direction property)
        'strokeAlign', // string ('INSIDE' or 'OUTSIDE', similar to box-sizing property)
        'strokeTopWeight', // number (all 4 of these properties are the widths of the border on each side)
        'strokeRightWeight', // number
        'strokeBottomWeight', // number
        'strokeLeftWeight', // number
        'strokeWeight', // number (combined value of all border weights, if same)
        'strokes', // {type: string, visible: boolean, opacity: number, blendMode: string, color: {b: number, g: number, r: number}} (can pull border properties from here)
      ],
    },
    {
      type: 'RECTANGLE',
      properties: [
        'height', // number
        'width', // number
        'bottomLeftRadius', // number
        'bottomRightRadius', // number
        'topLeftRadius', // number
        'topRightRadius', // number
        'cornerRadius', // number (combination of the 4 values for each corner, if same)
        'backgrounds', // {type: string, visible: boolean, opacity: number, blendMode: string, color: {b: number, g: number, r: number}}
        'fills', // {type: string, visible: boolean, opacity: number, blendMode: string, color: {b: number, g: number, r: number}}
        'name', // string (name of the element in Figma, aka 'component/button')
        'description', // string
        'opacity', // number
        'rotation', // number
        'paddingTop', // number
        'paddingRight', // number
        'paddingBottom', // number
        'paddingLeft', // number
        'itemSpacing', // number (spacing between elements inside the container, aka gap)
        'layoutMode', // string ('HORIZONTAL' or 'VERTICAL', similar to flex-direction property)
        'strokeAlign', // string ('INSIDE' or 'OUTSIDE', similar to box-sizing property)
        'strokeTopWeight', // number (all 4 of these properties are the widths of the border on each side)
        'strokeRightWeight', // number
        'strokeBottomWeight', // number
        'strokeLeftWeight', // number
        'strokeWeight', // number (combined value of all border weights, if same)
        'strokes', // {type: string, visible: boolean, opacity: number, blendMode: string, color: {b: number, g: number, r: number}} (can pull border properties from here)
      ],
    },
    { type: 'ELLIPSE', properties: ['height', 'width'] },
    { type: 'TEXT', properties: ['height', 'width'] },
  ]

  // Logic to extract only the nodes under the custom filter defined above.
  const frameNodesUnfiltered: FrameNode[] = []
  pages.map((page) => {
    return page.children.map((el) => {
      if (el.type === 'FRAME') frameNodesUnfiltered.push(el)
    })
  })

  const frameNodes: FrameNode[] = frameNodesUnfiltered.filter(
    (item) => item.name.split('/')[0] === customFilter
  )

  const componentNodes: SceneNode[] = []
  frameNodes.map((frame) => {
    frame.children.map((el) => {
      if (el.name.split('/')[0] === 'component') componentNodes.push(el)
    })
  })

  /////////////////////////////////////////////////////////////////////////

  let componentsCollection = { components: {} }

  componentNodes.map((component: ComponentNode) => {
    if (component.name.split('/')[0] === 'component') {
      const componentName = component.name.split('/')[1]
      const { wrapper: componentWrapper } = (componentsCollection.components[
        componentName
      ] = { wrapper: {} })
      // Extract relevant data from the component
      const { properties: validPropertiesComponent } = componentTypes.filter(
        (prop) => prop.type === 'COMPONENT'
      )[0]
      for (let property in component) {
        if (validPropertiesComponent.includes(property)) {
          componentWrapper[property] = component[property]
        }
      }
      // Extract relevant data from the component's children
      component.children.map((child) => {
        const componentChild = (componentsCollection.components[componentName][
          child.name.split('/')[1]
        ] = {})
        const { properties: validPropertiesChild } = componentTypes.filter(
          (prop) => prop.type === child.type
        )[0]

        for (let property in child) {
          if (validPropertiesChild.includes(property)) {
            componentChild[property] = child[property]
          }
        }
      })
    }
  })

  console.log(componentsCollection)
}
