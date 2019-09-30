// find each instance of layer in all comps
// swap for another comp

var comps = getAllComps()
selectCompsPrompt(
  comps,
  function(layerToSwap, compToSwapFor) {
    replaceAll(comps, layerToSwap, compToSwapFor)
  },
  function() {}
)

// return a layer by it's name - not really needed
function layerByName(comp, layerName) {
  return comp.layer(layerName)
}

// replaces the source for a layer by the source name
function replaceAVItemByName(layer, sourceName) {
  // find the AV item in the project
  var newSource = findAVItemByName(sourceName)

  if (!newSource) {
    throw 'could not find the new source item: ' + sourceName
    return
  }

  // replace the source of the layer
  return replaceAVItem(layer, newSource)
}

// replaces the source for a layer by the source name
function replaceAVItem(layer, avItem) {
  return layer.replaceSource(avItem, false)
}

// returns a footageItem or compItem
function findAVItemByName(name) {
  var proj = app.project
  var itms = proj.items
  var itmsLen = itms.length
  var curItem, avItem

  // i from 1 instead of 0
  // was throwing errors at 0 being out of bounds
  for (var i = 1; i <= itmsLen; i++) {
    curItem = itms[i]

    if (curItem.name == name) {
      avItem = curItem

      break
    }
  }

  return avItem
}

function getAllComps() {
  var proj = app.project
  var items = proj.items
  var comps = []

  // i from 1 instead of 0
  // was throwing errors at 0 being out of bounds
  for (var i = 1; i <= items.length; i++) {
    curItem = items[i]

    if (curItem instanceof CompItem) {
      comps.push(curItem)
    }
  }

  return comps
}

// loops through all comps
// replaces a comp layer with another comp
function replaceAll(comps, layerToSwap, compToSwapFor) {
  for (var i = 0; i < comps.length; i++) {
    var comp = comps[i]
    var swapLayer = layerByName(comp, layerToSwap)

    //   if the comp has the layer
    if (swapLayer) {
      //   and the layer source is a comp
      if (swapLayer.source instanceof CompItem) {
        // swap the layer source for the other comp
        replaceAVItemByName(swapLayer, compToSwapFor)
      }
    } else {
      // doesn't have the layer
    }
  }
}

function selectCompsPrompt(comps, onOk, onCancel) {
  var w = new Window('dialog', 'Select the comp to swap')
  w.orientation = 'column'

  var layersGroup = w.add('group', undefined, 'layersGroup')
  layersGroup.orientation = 'row'
  var layersTitle = layersGroup.add('statictext', undefined, 'Comp layer to find:')
  var layersDropdown = layersGroup.add('dropdownlist')
  // optionsTitle.alignment = 'left'

  var compsGroup = w.add('group', undefined, 'compsGroup')
  compsGroup.orientation = 'row'
  var compsTitle = compsGroup.add('statictext', undefined, 'Comp to replace with:')
  var compsDropdown = compsGroup.add('dropdownlist')

  var allLayers = []
  for (var i = 0; i < comps.length; i++) {
    var comp = comps[i]
    compsDropdown.add('item', comp.name)

    for (var j = 1; j < comp.layers.length + 1; j++) {
      var layer = comp.layers[j]
      if (layer.source instanceof CompItem) allLayers.push(layer.name)
      // layersDropdown.add('item', layer.name)
    }
  }

  var layers = remove_duplicates_safe(allLayers)

  for (var j = 0; j < layers.length; j++) {
    var layer = layers[j]

    layersDropdown.add('item', layer)
  }

  compsDropdown.selection = 0
  layersDropdown.selection = 0

  var buttonsGroup = w.add('group', undefined, 'buttonsGroup')
  buttonsGroup.orientation = 'row'
  var okButton = buttonsGroup.add('button', undefined, 'Replace')
  var cancelButton = buttonsGroup.add('button', undefined, 'Cancel')

  okButton.onClick = function() {
    w.hide()
    onOk(layersDropdown.selection.text, compsDropdown.selection.text)
  }

  cancelButton.onClick = function() {
    w.hide()
    onCancel()
  }

  w.show()

  return w
}

function remove_duplicates_safe(arr) {
  var seen = {}
  var ret_arr = []
  for (var i = 0; i < arr.length; i++) {
    if (!(arr[i] in seen)) {
      ret_arr.push(arr[i])
      seen[arr[i]] = true
    }
  }
  return ret_arr
}
