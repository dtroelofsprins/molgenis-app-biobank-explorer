import { expect } from 'chai'
import mutations, {
  SET_COLLECTION_IDS,
  SET_COLLECTION_TYPES,
  SET_DATA_TYPES,
  SET_BIOBANKS
} from '../../../../src/store/mutations'
import { mockState } from '../mockState'
import { covid19CollectionNetworkSelectionId, covid19NetworkId, covid19BiobankNetworkSelectionId } from '../../../../src/store/helpers/covid19Helper'

let state

describe('store', () => {
  beforeEach(() => {
    state = mockState()
  })
  describe('mutations', () => {
    describe('SET_COUNTRIES', () => {
      it('should set the countries in the state with the payload', () => {
        const countries = [{id: 'NL', name: 'Nederland'}, {id: 'BE', name: 'Belgie', label: 'Belgie'}, {id: 'DE', label: 'Duitsland'}]
        mutations.__SET_COUNTRIES__(state, countries)

        expect(state.country.options).to.deep.equal([{id: 'NL', name: 'Nederland'},
          {id: 'BE', name: 'Belgie', label: 'Belgie'}, {id: 'DE', label: 'Duitsland'}])
      })
    })

    describe('SET_DATA_TYPES', () => {
      it('should set the data types in the state with the payload', () => {
        const dataTypes = [{
          _href: '/api/v2/eu_bbmri_eric_data_types/BIOLOGICAL_SAMPLES',
          description: 'Y/N if biological samples are collected from the participants in the sample collection/study',
          id: 'BIOLOGICAL_SAMPLES',
          label: 'Biological samples'
        }, {
          _href: '/api/v2/eu_bbmri_eric_data_types/GENEALOGICAL_RECORDS',
          description: 'Y/N if genealogical records are associated with the participants in the sample collection/study',
          id: 'GENEALOGICAL_RECORDS',
          label: 'Genealogical records',
          ontology: 'Miabis'
        }]
        mutations[SET_DATA_TYPES](state, dataTypes)

        expect(state.dataType.options).to.deep.equal(dataTypes)
      })
    })

    describe('SET_COLLECTION_TYPES', () => {
      it('should set the collection types in the state with the payload', () => {
        const collectionTypes = [{
          _href: '/api/v2/eu_bbmri_eric_collection_types/BIRTH_COHORT',
          description: 'A cohort study for which the subjects are followed from the time of birth usually including information about gestation and follow up.',
          id: 'BIRTH_COHORT',
          label: 'Birth cohort'
        }, {
          _href: '/api/v2/eu_bbmri_eric_collection_types/CASE_CONTROL',
          description: 'A case-control study design compares two groups of subjects: those with the disease or condition under study (cases) and a very similar group of subjects who do not have the disease or condition (controls).',
          id: 'CASE_CONTROL',
          label: 'Case-Control'
        }]
        mutations[SET_COLLECTION_TYPES](state, collectionTypes)

        expect(state.type.options).to.deep.equal(collectionTypes)
      })
    })

    describe('SET_MATERIALS', () => {
      it('should set the material types in the state with the payload', () => {
        const materials = ['PLASMA', 'RNA', 'DNA']
        mutations.__SET_MATERIALS__(state, materials)

        expect(state.materials.options).to.deep.equal(materials)
      })
    })

    describe('SET_COLLECTION_QUALITY', () => {
      it('should set the qualities in the state with the payload', () => {
        const collectionQuality = ['eric']
        mutations.__SET_COLLECTION_QUALITY__(state, collectionQuality)

        expect(state.collection_quality.options).to.deep.equal(collectionQuality)
      })
    })

    describe('SET_BIOBANK_QUALITY', () => {
      it('should set the qualities in the state with the payload', () => {
        const biobankQuality = ['eric']
        mutations.__SET_BIOBANK_QUALITY__(state, biobankQuality)

        expect(state.biobank_quality.options).to.deep.equal(biobankQuality)
      })
    })

    describe('SET_COVID_19', () => {
      it('should set the COVID19 options in the state with the payload', () => {
        const covidOptionsLabel = [{id: 'covid19', label: 'member of covid 19 network'}]
        mutations.__SET_COVID_19__(state, covidOptionsLabel)

        expect(state.covid19.options).to.deep.equal(covidOptionsLabel)

        const covidOptionsName = [{id: 'covid19', name: 'member of covid 19 network'}]
        mutations.__SET_COVID_19__(state, covidOptionsName)

        expect(state.covid19.options).to.deep.equal(covidOptionsName)
      })
    })
    describe('SET_NETWORK_OPTIONS', () => {
      it('should set the network options for biobank and collections without covid19', () => {
        const testCase = [{id: 'test_network', label: 'My awesome test network'}]
        const covidOptionsLabel = [{id: covid19NetworkId, name: 'member of covid 19 network'}, testCase[0]]
        mutations.__SET_NETWORK_OPTIONS__(state, covidOptionsLabel)

        expect(state.biobank_network.options).to.deep.equal(testCase)
        expect(state.collection_network.options).to.deep.equal(testCase)
      })
    })

    describe('SET_DIAGNOSIS_AVAILABLE', () => {
      it('should set the diagnosis available in the state with the payload', () => {
        const payload = [{
          code: 'C22.3',
          label: 'Angiosarcoma of liver'
        }]
        mutations.__SET_DIAGNOSIS_AVAILABLE__(state, payload)

        const expected = [
          {
            code: 'C22.3',
            label: 'C22.3 - Angiosarcoma of liver',
            originalLabel: 'Angiosarcoma of liver'
          }
        ]
        expect(state.diagnosis_available.options).to.deep.equal(expected)
      })
    })

    describe('UPDATE_FILTER', () => {
      it('should update the list of filters for a specific state key', () => {
        const countries = ['NL', 'BE']
        mutations.__UPDATE_FILTER__(state, {name: 'country', filters: countries})

        expect(state.country.filters).to.deep.equal(countries)
      })

      it('should only set covid19networkId to biobank_network filter when covid19network biobank checkbox has been selected', () => {
        mutations.__SET_COVID_19_NETWORK__(state, [covid19BiobankNetworkSelectionId])
        expect(state.biobank_network.filters).to.deep.equal([covid19NetworkId])
        expect(state.collection_network.filters).to.deep.equal([])
      })

      it('should only set covid19networkId to collection_network filter when covid19network collection checkbox has been selected', () => {
        mutations.__SET_COVID_19_NETWORK__(state, [covid19CollectionNetworkSelectionId])
        expect(state.collection_network.filters).to.deep.equal([covid19NetworkId])
        expect(state.biobank_network.filters).to.deep.equal([])
      })

      it('should clear biobank covid19network id if not selected', () => {
        state.biobank_network.filters = ['networkA', covid19NetworkId, 'networkB']
        state.collection_network.filters = [covid19NetworkId]
        mutations.__SET_COVID_19_NETWORK__(state, [covid19CollectionNetworkSelectionId])
        expect(state.biobank_network.filters).to.deep.equal(['networkA', 'networkB'])
      })

      it('should only set the covid19 network id once, even if already present', () => {
        state.collection_network.filters = [covid19NetworkId]
        mutations.__SET_COVID_19_NETWORK__(state, [covid19CollectionNetworkSelectionId])
        expect(state.collection_network.filters).to.deep.equal([covid19NetworkId])
      })
    })

    describe('RESET_FILTERS', () => {
      it('should reset all the filters in the state', () => {
        state.country = {
          filters: ['AT'],
          options: [{id: 'AT', name: 'Austria'}]
        }
        state.materials = {
          filters: ['PLASMA'],
          options: [{id: 'PLASMA', label: 'Plasma'}]
        }
        state.diagnosis_available.filters = ['C18']
        state.collection_quality.filters = ['Awesome standard']
        state.biobank_quality.filters = ['Awesome standard']

        state.type = {
          filters: ['type'],
          options: [{id: 'type'}]
        }
        state.covid19 = {
          filters: ['covid19'],
          options: [{id: 'covid19'}]
        }
        state.dataType = {
          filters: ['type'],
          options: [{id: 'type'}]
        }

        mutations.__RESET_FILTERS__(state)

        const expected = mockState()
        expected.country.options = [{id: 'AT', name: 'Austria'}]
        expected.materials.options = [{id: 'PLASMA', label: 'Plasma'}]
        expected.type.options = [{id: 'type'}]
        expected.covid19.options = [{id: 'covid19'}]
        expected.dataType.options = [{id: 'type'}]

        expect(state.country).to.deep.equal(expected.country)
        expect(state.materials).to.deep.equal(expected.materials)
        expect(state.diagnosis_available).to.deep.equal(expected.diagnosis_available)
        expect(state.collection_quality).to.deep.equal(expected.collection_quality)
      })
    })

    describe('SET_BIOBANKS', () => {
      it('should add the biobanks to the store', () => {
        const biobank1 = {id: 'biobank1', collections: []}
        const biobank2 = {id: 'biobank2', collections: []}
        state.biobanks = {
          biobank1
        }

        const biobanks = [biobank2]

        mutations[SET_BIOBANKS](state, biobanks)

        expect(state.biobanks).to.deep.equal({biobank1, biobank2})
      })
      it('should reconstruct the collections tree', () => {
        const biobanks = [{
          id: 'biobank1',
          collections: [
            {id: 1, sub_collections: [{id: 2}]},
            {id: 2, parent: 1, sub_collections: [{id: 3}]},
            {id: 3, parent: 2, sub_collections: [{id: 4}]},
            {id: 4, parent: 3, sub_collections: []}]
        }]
        const expected = {
          id: 'biobank1',
          collections: [
            {
              id: 1,
              sub_collections: [{
                id: 2,
                parent: 1,
                sub_collections: [{
                  id: 3,
                  parent: 2,
                  sub_collections: [{
                    id: 4,
                    parent: 3,
                    sub_collections: []
                  }]
                }]
              }]
            }]
        }
        mutations[SET_BIOBANKS](state, biobanks)

        expect(state.biobanks['biobank1']).to.deep.equal(expected)
      })
    })

    describe('SET_COLLECTION_IDS', () => {
      it('should set the collection ids in the state with the payload', () => {
        const collectionIds = ['1', '2']

        mutations[SET_COLLECTION_IDS](state, collectionIds)

        expect(state.collectionIds).to.deep.equal(collectionIds)
      })
    })

    describe('SET_ERROR', () => {
      it('should set the error in the state with the payload', () => {
        const error = 'error'
        mutations.__SET_ERROR__(state, error)

        expect(state.error).to.equal(error)
      })
    })

    describe('SET_SEARCH', () => {
      it('should set the search query in the state with the payload', () => {
        const search = 'this is a search'
        mutations.__SET_SEARCH__(state, search)

        expect(state.search).to.equal(search)
      })
    })

    describe('MAP_QUERY_TO_STATE', () => {
      it('should map everything from router query to state without diagnoses', () => {
        state.route = {
          query: {
            country: 'NL,BE',
            materials: 'RNA,PLASMA',
            collection_quality: 'eric,self',
            search: 'search',
            type: 'BIRTH_COHORT',
            dataType: 'BIOLOGICAL_SAMPLES',
            nToken: '29djgCm29104958f7dLqopf92JDJKS',
            biobank_network: 'networkA,networkB',
            biobank_quality: 'qualityA',
            collection_network: 'networkC,networkD',
            covid19: 'covid19'
          }
        }

        mutations.__MAP_QUERY_TO_STATE__(state)

        expect(state.country.filters).to.deep.equal(['NL', 'BE'])
        expect(state.materials.filters).to.deep.equal(['RNA', 'PLASMA'])
        expect(state.type.filters).to.deep.equal(['BIRTH_COHORT'])
        expect(state.covid19.filters).to.deep.equal(['covid19'])
        expect(state.dataType.filters).to.deep.equal(['BIOLOGICAL_SAMPLES'])
        expect(state.collection_quality.filters).to.deep.equal(['eric', 'self'])
        expect(state.covid19.filters).to.deep.equal(['covid19'])
        expect(state.biobank_network.filters).to.deep.equal(['networkA', 'networkB'])
        expect(state.biobank_quality.filters).to.deep.equal(['qualityA'])
        expect(state.search).to.equal('search')
        expect(state.nToken).to.equal('29djgCm29104958f7dLqopf92JDJKS')
      })

      it('should map everything from router query to state with diagnoses', () => {
        state.route = {
          query: {
            country: 'NL,BE',
            materials: 'RNA,PLASMA',
            collection_quality: 'eric,self',
            search: 'search',
            nToken: '29djgCm29104958f7dLqopf92JDJKS'
          }
        }

        const payload = [{
          code: 'C22.3',
          label: 'Angiosarcoma of liver'
        }]
        mutations.__MAP_QUERY_TO_STATE__(state, {diagnoses: payload})

        const expected = [
          {
            code: 'C22.3',
            label: 'C22.3 - Angiosarcoma of liver',
            originalLabel: 'Angiosarcoma of liver'
          }
        ]

        expect(state.country.filters).to.deep.equal(['NL', 'BE'])
        expect(state.materials.filters).to.deep.equal(['RNA', 'PLASMA'])
        expect(state.collection_quality.filters).to.deep.equal(['eric', 'self'])
        expect(state.diagnosis_available.filters).to.deep.equal(expected)
        expect(state.search).to.equal('search')
        expect(state.nToken).to.equal('29djgCm29104958f7dLqopf92JDJKS')
      })
    })

    describe('SET_BIOBANK_QUALITY_BIOBANKS', () => {
      it('should set the biobanks that match the applied quality standards filter', () => {
        const payload = [
          {
            biobank: {id: 'biobank-1'},
            quality_standard: {id: 'iso-15189', label: 'ISO 15189:2012'},
            assess_level_col: {id: 'eric', label: 'BBMRI-ERIC audited'}
          },
          {
            biobank: {id: 'biobank-1'},
            quality_standard: {id: 'iso-17043-2010', label: 'ISO 17043:2010'},
            assess_level_col: {id: 'accredited', label: 'Certified by accredited body'}
          },
          {
            biobank: {id: 'biobank-2'},
            quality_standard: {id: 'iso-17043-2010', label: 'ISO 17043:2010'},
            assess_level_col: {id: 'eric', label: 'BBMRI-ERIC audited'}
          }
        ]

        const expected = ['biobank-1', 'biobank-2']

        mutations.__SET_BIOBANK_QUALITY_BIOBANKS__(state, payload)

        expect(state.biobank_quality.biobanks).to.deep.equal(expected)
      })

      it('should set an invalid collection id when the filter applied on the biobank quality standards returns no matching biobanks', () => {
        state.biobank_quality.filters = ['eric']

        const payload = []

        const expected = ['invalid_biobank']

        mutations.__SET_BIOBANK_QUALITY_BIOBANKS__(state, payload)

        expect(state.biobank_quality.biobanks).to.deep.equal(expected)
      })
    })

    describe('SET_COLLECTION_QUALITY_COLLECTIONS', () => {
      it('should set the cols that match the applied quality standards filter', () => {
        const payload = [
          {
            collection: {id: 'col-1'},
            quality_standard: {id: 'iso-15189', label: 'ISO 15189:2012'},
            assess_level_col: {id: 'eric', label: 'BBMRI-ERIC audited'}
          },
          {
            collection: {id: 'col-1'},
            quality_standard: {id: 'iso-17043-2010', label: 'ISO 17043:2010'},
            assess_level_col: {id: 'accredited', label: 'Certified by accredited body'}
          },
          {
            collection: {id: 'col-2'},
            quality_standard: {id: 'iso-17043-2010', label: 'ISO 17043:2010'},
            assess_level_col: {id: 'eric', label: 'BBMRI-ERIC audited'}
          }
        ]

        const expected = ['col-1', 'col-2']

        mutations.__SET_COLLECTION_QUALITY_COLLECTIONS__(state, payload)

        expect(state.collection_quality.collections).to.deep.equal(expected)
      })

      it('should set an invalid collection id when the filter applied on the col quality standards returns no matching cols', () => {
        state.collection_quality.filters = ['eric']

        const payload = []

        const expected = ['invalid_collection']

        mutations.__SET_COLLECTION_QUALITY_COLLECTIONS__(state, payload)

        expect(state.collection_quality.collections).to.deep.equal(expected)
      })
    })

    describe('SET_BIOBANK_REPORT', () => {
      it('should set the biobank report value in the state with the payload', () => {
        const payload = {id: 'biobank-1-other'}
        mutations.__SET_BIOBANK_REPORT__(state, payload)
        expect(state.biobankReport).to.deep.equal(payload)
      })
    })

    describe('SET_COLLECTION_REPORT', () => {
      it('should set the collection report value in the state with the payload', () => {
        const payload = {
          _meta: {
            name: 'meta'
          },
          id: '001',
          name: 'beautiful collection',
          description: 'beautiful samples'
        }

        mutations.__SET_COLLECTION_REPORT__(state, payload)

        expect(state.collectionReport).to.deep.equal(payload)
      })
    })

    describe('SET_NETWORK_REPORT', () => {
      it('should set the network report value in the state with the payload', () => {
        const payload = {
          _meta: {
            name: 'meta'
          },
          id: '001',
          name: 'beautiful network',
          description: 'beautiful data'
        }

        mutations.__SET_NETWORK_REPORT__(state, payload)

        expect(state.networkReport.network).to.deep.equal(payload)
      })
    })

    describe('SET_NETWORK_COLLECTIONS', () => {
      it('should set the network collections in the state with the payload', () => {
        const payload = []
        mutations.__SET_NETWORK_COLLECTIONS__(state, payload)
        expect(state.networkReport.collections).to.deep.equal(payload)
      })
    })

    describe('SET_NETWORK_BIOBANKS', () => {
      it('should set the network biobanks in the state with the payload', () => {
        const payload = []
        mutations.__SET_NETWORK_BIOBANKS__(state, payload)
        expect(state.networkReport.biobanks).to.deep.equal(payload)
      })
    })

    describe('SET_LOADING', () => {
      it('should set the loading boolean in the state', () => {
        mutations.__SET_LOADING__(state, true)

        expect(state.isLoading).to.deep.equal(true)
      })
    })

    describe('SET_LOADING', () => {
      it('should set the loading boolean in the state', () => {
        mutations.__SET_LOADING__(state, true)

        expect(state.isLoading).to.deep.equal(true)
      })
    })
  })
})
